import os
import os.path as osp
import glob

import cv2
import torch

import recognition.SRModels.EDVR.utils.util as util
import recognition.SRModels.EDVR.utils.test_util as test_util
import recognition.SRModels.EDVR.models.archs.EDVR_arch as EDVR_arch


def generate():
    #################
    # configurations
    #################
    os.environ["CUDA_VISIBLE_DEVICES"] = "0"
    device = torch.device("cuda")
    model_path = "/recognition/SRModels/EDVR/models/EDVRaligned.pth"

    # default configuration
    nf = 64
    N_in = 5
    predeblur, HR_in = False, False
    back_RBs = 10
    test_dataset_folder = "/recognition/SRModels/data"
    model = EDVR_arch.EDVR(nf, N_in, 8, 5, back_RBs, predeblur=predeblur, HR_in=HR_in)

    # responses
    result = 1

    # evaluation
    padding = "replicate"

    # Reconfig logger handler
    save_folder = "/recognition/SRModels/EDVR/results/"

    # set up the models
    model.load_state_dict(torch.load(model_path), strict=True)
    model.eval()
    model = model.to(device)

    # Get images list
    img_path_l = sorted(glob.glob(osp.join(test_dataset_folder, "*")))
    max_idx = len(img_path_l)
    util.mkdirs(save_folder)

    # Clean up the redundancies
    for imgPath in img_path_l[5:]:
        os.remove(imgPath)

    # read LQ and GT images
    imgs_LQ = test_util.read_img_seq(test_dataset_folder)
    if None in set(imgs_LQ):
        result = 0

    # process each image
    if result != 0:
        for img_idx, img_path in enumerate(img_path_l):
            img_name = osp.splitext(osp.basename(img_path))[0]
            select_idx = test_util.index_generation(img_idx, max_idx, N_in, padding=padding)
            imgs_in = (
                imgs_LQ.index_select(0, torch.LongTensor(select_idx))
                .unsqueeze(0)
                .to(device)
            )

            output = test_util.single_forward(model, imgs_in)
            output = util.tensor2img(output.squeeze(0))
            cv2.imwrite(osp.join(save_folder, "{}.png".format(img_name)), output)

    return result
