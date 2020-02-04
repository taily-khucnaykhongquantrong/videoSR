import logging
from collections import OrderedDict

import torch
import torch.nn as nn
from torch.nn.parallel import DataParallel, DistributedDataParallel
import models.networks as networks
import models.lr_scheduler as lr_scheduler
from .base_model import BaseModel
from models.archs.loss import CharbonnierLoss

logger = logging.getLogger("base")


class VideoSRBaseModel(BaseModel):
    def __init__(self, opt):
        super(VideoSRBaseModel, self).__init__(opt)

        if opt["dist"]:
            self.rank = torch.distributed.get_rank()
        else:
            self.rank = -1  # non dist training
        train_opt = opt["train"]

        # define network and load pretrained models
        self.netG = networks.define_G(opt).to(self.device)
        if opt["dist"]:
            self.netG = DistributedDataParallel(
                self.netG, device_ids=[torch.cuda.current_device()]
            )
        else:
            self.netG = DataParallel(self.netG)
        # print network
        self.print_network()
        self.load()

        if self.is_train:
            self.netG.train()

            #### loss
            loss_type = train_opt["pixel_criterion"]
            if loss_type == "l1":
                self.cri_pix = nn.L1Loss(reduction="sum").to(self.device)
            elif loss_type == "l2":
                self.cri_pix = nn.MSELoss(reduction="sum").to(self.device)
            elif loss_type == "cb":
                self.cri_pix = CharbonnierLoss().to(self.device)
            else:
                raise NotImplementedError(
                    "Loss type [{:s}] is not recognized.".format(loss_type)
                )
            self.cri_aligned = (
                nn.L1Loss(reduction="sum").to(self.device)
                if train_opt["aligned_criterion"]
                else None
            )
            self.l_pix_w = train_opt["pixel_weight"]

            #### optimizers
            wd_G = train_opt["weight_decay_G"] if train_opt["weight_decay_G"] else 0
            if train_opt["ft_tsa_only"]:
                normal_params = []
                tsa_fusion_params = []
                for k, v in self.netG.named_parameters():
                    if v.requires_grad:
                        if "tsa_fusion" in k:
                            tsa_fusion_params.append(v)
                        else:
                            normal_params.append(v)
                    else:
                        if self.rank <= 0:
                            logger.warning("Params [{:s}] will not optimize.".format(k))
                optim_params = [
                    {  # add normal params first
                        "params": normal_params,
                        "lr": train_opt["lr_G"],
                    },
                    {"params": tsa_fusion_params, "lr": train_opt["lr_G"]},
                ]
            else:
                optim_params = []
                for k, v in self.netG.named_parameters():
                    if v.requires_grad:
                        optim_params.append(v)
                    else:
                        if self.rank <= 0:
                            logger.warning("Params [{:s}] will not optimize.".format(k))

            self.optimizer_G = torch.optim.Adam(
                optim_params,
                lr=train_opt["lr_G"],
                weight_decay=wd_G,
                betas=(train_opt["beta1"], train_opt["beta2"]),
            )
            self.optimizers.append(self.optimizer_G)

            #### schedulers
            if train_opt["lr_scheme"] == "MultiStepLR":
                for optimizer in self.optimizers:
                    self.schedulers.append(
                        lr_scheduler.MultiStepLR_Restart(
                            optimizer,
                            train_opt["lr_steps"],
                            restarts=train_opt["restarts"],
                            weights=train_opt["restart_weights"],
                            gamma=train_opt["lr_gamma"],
                            clear_state=train_opt["clear_state"],
                        )
                    )
            elif train_opt["lr_scheme"] == "CosineAnnealingLR_Restart":
                for optimizer in self.optimizers:
                    self.schedulers.append(
                        lr_scheduler.CosineAnnealingLR_Restart(
                            optimizer,
                            train_opt["T_period"],
                            eta_min=train_opt["eta_min"],
                            restarts=train_opt["restarts"],
                            weights=train_opt["restart_weights"],
                        )
                    )
            else:
                raise NotImplementedError()

            self.log_dict = OrderedDict()

    def feed_data(self, data, need_GT=True):
        self.var_L = data["LQs"].to(self.device)
        if need_GT:
            self.real_H = data["GT"].to(self.device)

    def set_params_lr_zero(self):
        # fix normal module
        self.optimizers[0].param_groups[0]["lr"] = 0

    def optimize_parameters(self, step):
        if self.opt["train"]["ft_tsa_only"] and step < self.opt["train"]["ft_tsa_only"]:
            self.set_params_lr_zero()

        train_opt = self.opt["train"]
        opt_net = self.opt["network_G"]

        self.optimizer_G.zero_grad()
        self.fake_H, aligned_fea = self.netG(self.var_L)

        l_total = 0

        # Pixel loss
        l_pix = self.l_pix_w * self.cri_pix(self.fake_H, self.real_H)
        l_total += l_pix

        # Aligned loss
        B, N, C, H, W = self.var_L.size()  # N video frames
        center = N // 2
        nf = opt_net["nf"]
        fea2imgConv = nn.Conv2d(nf, 3, 3, 1, 1)
        fea2imgConv.eval()
        # Fix bug: Input type and weight type should be the same
        # Feature is cuda(), so the model must be cuda()
        fea2imgConv.cuda()

        # Stack N of center LR images
        var_L_center = self.var_L[:, center, :, :, :].contiguous()
        var_L_center_expanded = var_L_center.expand(1, -1, -1, -1, -1)
        var_L_center_repeated = var_L_center_expanded.repeat(N, 1, 1, 1, 1)
        var_L_stacked_center = torch.transpose(var_L_center_repeated, 0, 1)

        # Assign center frame to center aligned feature
        with torch.no_grad():
            aligned_img = fea2imgConv(aligned_fea.view(-1, nf, H, W)).view(
                B, N, -1, H, W
            )
        aligned_img[:, center, :, :, :] = var_L_center

        l_aligned = (
            1 / (N - 1) * self.cri_aligned(aligned_img, var_L_stacked_center)
            if train_opt["aligned_criterion"]
            else 0
        )
        l_total += l_aligned

        l_total.backward()

        self.optimizer_G.step()

        # set log
        self.log_dict["l_pix"] = l_pix.item()
        if train_opt["aligned_criterion"]:
            self.log_dict["l_aligned"] = l_aligned.item()
            self.log_dict["l_total"] = l_total.item()

    def test(self):
        self.netG.eval()
        with torch.no_grad():
            self.fake_H = self.netG(self.var_L)
        self.netG.train()

    def get_current_log(self):
        return self.log_dict

    def get_current_visuals(self, need_GT=True):
        out_dict = OrderedDict()
        out_dict["LQ"] = self.var_L.detach()[0].float().cpu()
        out_dict["restore"] = self.fake_H.detach()[0].float().cpu()
        if need_GT:
            out_dict["GT"] = self.real_H.detach()[0].float().cpu()
        return out_dict

    def print_network(self):
        s, n = self.get_network_description(self.netG)
        if isinstance(self.netG, nn.DataParallel):
            net_struc_str = "{} - {}".format(
                self.netG.__class__.__name__, self.netG.module.__class__.__name__
            )
        else:
            net_struc_str = "{}".format(self.netG.__class__.__name__)
        if self.rank <= 0:
            logger.info(
                "Network G structure: {}, with parameters: {:,d}".format(
                    net_struc_str, n
                )
            )
            logger.info(s)

    def load(self):
        load_path_G = self.opt["path"]["pretrain_model_G"]
        if load_path_G is not None:
            logger.info("Loading model for G [{:s}] ...".format(load_path_G))
            self.load_network(load_path_G, self.netG, self.opt["path"]["strict_load"])

    def save(self, iter_label):
        self.save_network(self.netG, "G", iter_label)
