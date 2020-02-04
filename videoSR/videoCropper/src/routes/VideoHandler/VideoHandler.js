import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";

import Layout from "../../components/Layout/layout";
import Cropper from "../../components/cropper";
import VideoPlayer from "../../components/videoPlayer";
import Box from "../../components/box";
import Button from "../../components/button";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import s from "./VideoHandler.module.scss";
import Modal from "../../components/Modal/Modal";
import Link from "../../components/Link";

const upscaleIcon = <i className="ni ni-zoom-split-in" />;
const sendingIcon = <i className="ni ni-cloud-upload-96" />;
const loadingIcon = <Loader type="Bars" color="#fff" height={20} width={20} />;

const toBase64 = imgPath => {
  const img = new Image();

  img.src = imgPath;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const dataURL = canvas.toDataURL("image/png");
    sessionStorage.setItem("dataURL", dataURL);
  };
};

class VideoHandler extends React.Component {
  constructor(props) {
    super(props);
    const { videoInfo } = this.props;
    this.defaultVideoWidth = videoInfo.width;
    this.defaultVideoHeight = videoInfo.height;
    this.src = `/${videoInfo.location}`;

    this.state = {
      crop: {
        unit: "%",
        aspect: null,
        x: 0,
        y: 0,
        width: (128 / this.defaultVideoWidth) * 100,
        height: (128 / this.defaultVideoHeight) * 100,
      },
      disabled: true,
      currentTime: 0,
      resultText: "R 66452",
      isUpscaleLoading: false,
      isAPILoading: false,
      isModal: false,
    };

    // Refs
    this.canvasRef = React.createRef();
    this.videoRef = React.createRef();
    this.modalRef = React.createRef();
  }

  setCrop = (state, fn = () => {}) => {
    this.setState({ crop: state }, fn);
  };

  setDisable = (state, fn = () => {}) => {
    this.setState({ disabled: state }, fn);
  };

  setCurrentTime = (state, fn = () => {}) => {
    this.setState({ currentTime: state }, fn);
  };

  setUpscaleLoading = (state, fn = () => {}) => {
    this.setState({ isUpscaleLoading: state }, fn);
  };

  setAPILoading = (state, fn = () => {}) => {
    this.setState({ isAPILoading: state }, fn);
  };

  setModal = (state, fn = () => {}) => {
    this.setState({ isModal: state }, fn);
  };

  setModalText = (state, fn = () => {}) => {
    this.setState({ resultText: state }, fn);
  };

  // Methods
  onModalClick = () => {
    this.setModal(false);
  };

  upscale = async () => {
    const { crop, currentTime } = this.state;
    const { defaultVideoWidth, defaultVideoHeight } = this;
    const ratio = [
      0,
      0,
      defaultVideoWidth / 100,
      defaultVideoHeight / 100,
      defaultVideoWidth / 100,
      defaultVideoHeight / 100,
    ];
    const convertCrop = Object.fromEntries(
      Object.entries(crop).map(
        ([key, value], index) =>
          (index > 1 && [key, Math.round(value * ratio[index])]) || [key, null]
      )
    );
    const { unit, aspect, ...cropData } = convertCrop;
    const requestData = { ...cropData, currentTime };
    const csrftoken = Cookies.get("csrftoken");

    this.setUpscaleLoading(true, () => {
      axios
        .post("http://localhost:8000/api/sr/", requestData, {
          headers: { "X-CSRFToken": csrftoken },
        })
        .then(response => {
          const ctx = this.canvasRef.current.getContext("2d");
          const img = new Image();
          const { result } = response.data;

          // Always select the middle file
          if (`${result}` === "1") {
            img.src = "/static/results/03.png";
          }

          const ratioCanvas = this.canvasRef.current.width / img.width;
          img.onload = () => {
            ctx.drawImage(
              img,
              0,
              0,
              img.width * ratioCanvas,
              img.height * ratioCanvas
            );
          };
          this.setUpscaleLoading(false);
        })
        .catch(err => {
          console.error(err);
          this.setUpscaleLoading(false);
        });
    });
  };

  ocrAPI = async () => {
    // Configuration for OCR.Space API
    const options = {
      apikey: "",
      language: "eng",
      isOverlayRequired: true,
      OCREngine: 2,
      filetype: "PNG",
    };
    const imgPath = "/static/results/03.png";
    await toBase64(imgPath);
    const stringBase64File = sessionStorage.getItem("dataURL");

    const formData = new FormData();
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("base64Image", stringBase64File);
    // const object = {};
    // formData.forEach((value, key) => {
    //   object[key] = value;
    // });
    // const json = JSON.stringify(object);
    // console.info(json);

    this.setAPILoading(true, () => {
      // setTimeout(() => {
      //   this.setAPILoading(false);
      //   this.setModal(true);
      // }, 3000);
      axios
        .post("https://api.ocr.space/parse/image", formData)
        .then(result => {
          const { ParsedText } = result.data.ParsedResults[0];
          this.setModal(true);
          this.setAPILoading(false);
          this.setModalText(ParsedText);
        })
        .catch(error => {
          console.error(error);
          this.setAPILoading(false);
        });
    });
  };

  render() {
    // Initial variables
    const {
      resultText,
      disabled,
      isUpscaleLoading,
      isAPILoading,
      isModal,
    } = this.state;
    const { videoInfo } = this.props;
    const { src } = this;
    const canvas = <canvas style={{ width: "100%" }} ref={this.canvasRef} />;
    const videoPlayer = (
      <VideoPlayer
        ref={this.videoRef}
        onDisableCrop={this.setDisable}
        onSetCurrentTime={this.setCurrentTime}
        src={src}
      />
    );

    return (
      <Layout>
        <Row>
          <Col>
            <Breadcrumb className={s.breadcrumbs} tag="nav" listTag="div">
              <BreadcrumbItem>
                <Link className={s.breadItem} to="/">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link className={s.breadItem} to="/library">
                  Library
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{videoInfo.name}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            <Cropper
              croppedImgRef={this.canvasRef}
              disabled={disabled}
              renderComponent={videoPlayer}
              videoPlayer={this.videoRef}
              onCropDone={this.setCrop}
            />
          </Col>
          <Col md={4}>
            <Row>
              <Col>
                <Box className={s.resultBox}>
                  {canvas}
                  <div className={s.buttonBar}>
                    <Button onClick={this.upscale}>
                      <span>
                        {(isUpscaleLoading && loadingIcon) || upscaleIcon}
                      </span>
                    </Button>
                    <Button onClick={this.ocrAPI}>
                      <span>
                        {(isAPILoading && loadingIcon) || sendingIcon}
                      </span>
                    </Button>
                  </div>
                </Box>
              </Col>
            </Row>
          </Col>
        </Row>
        {isModal && (
          <Modal
            onClick={this.onModalClick}
            text={resultText}
            ref={this.modalRef}
          />
        )}
      </Layout>
    );
  }
}

VideoHandler.propTypes = {
  videoInfo: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
};

export default VideoHandler;
