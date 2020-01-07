import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";

import Layout from "../../components/Layout/layout";
import Cropper from "../../components/cropper";
import VideoPlayer from "../../components/videoPlayer";
import Box from "../../components/box";
import Button from "../../components/button";

import s from "./Library.module.scss";

const upscaleIcon = <i className="ni ni-zoom-split-in" />;
const sendingIcon = <i className="ni ni-cloud-upload-96" />;

const Library = props => {
  // Constructor
  const { videoInfo } = props;
  const defaultVideoWidth = videoInfo.width;
  const defaultVideoHeight = videoInfo.height;
  const src = videoInfo.location;

  // States
  const [crop, setCrop] = useState({
    unit: "%",
    aspect: null,
    x: 0,
    y: 0,
    width: (128 / defaultVideoWidth) * 100,
    height: (128 / defaultVideoHeight) * 100,
  });
  const [disabled, setDisable] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  // Refs
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // Initial variables
  const canvas = <canvas style={{ width: "100%" }} ref={canvasRef} />;
  const videoPlayer = (
    <VideoPlayer
      ref={videoRef}
      onDisableCrop={setDisable}
      onSetCurrentTime={setCurrentTime}
      src={src}
    />
  );
  const ratio = [
    0,
    0,
    defaultVideoWidth / 100,
    defaultVideoHeight / 100,
    defaultVideoWidth / 100,
    defaultVideoHeight / 100,
  ];

  // Methods
  const upscale = () => {
    const convertCrop = Object.fromEntries(
      Object.entries(crop).map(
        ([key, value], index) =>
          (index > 1 && [key, Math.round(value * ratio[index])]) || [key, null]
      )
    );
    const { unit, aspect, ...cropData } = convertCrop;
    const data = { ...cropData, currentTime };
    const csrftoken = Cookies.get("csrftoken");

    axios
      .post("http://localhost:8000/api/sr/", data, {
        headers: { "X-CSRFToken": csrftoken },
      })
      .then(response => console.info(response));
  };

  return (
    <Layout>
      <Row>
        <Col xs={12} md={8}>
          <Cropper
            croppedImgRef={canvasRef}
            disabled={disabled}
            renderComponent={videoPlayer}
            videoPlayer={videoRef}
            onCropDone={setCrop}
          />
        </Col>
        <Col md={4}>
          <Row>
            <Col>
              <Box className={s.resultBox}>
                {canvas}
                <div className={s.buttonBar}>
                  <Button onClick={upscale}>
                    <span>{upscaleIcon}</span>
                  </Button>
                  <Button>
                    <span>{sendingIcon}</span>
                  </Button>
                </div>
              </Box>
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <div>
                <div>{`Current time: ${currentTime}`}</div>
                {Object.keys(crop).map(
                  (key, index) =>
                    index >= 2 && (
                      <div key={key}>{`${key}: ${Math.round(
                        crop[key] * ratio[index]
                      )}`}</div>
                    )
                )}
              </div>
            </Col>
          </Row> */}
        </Col>
      </Row>
    </Layout>
  );
};

Library.propTypes = {
  videoInfo: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
};

export default Library;
