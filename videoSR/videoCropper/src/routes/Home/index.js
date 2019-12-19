import React, { useRef, useState } from "react";
import { Row, Col } from "reactstrap";

import Layout from "../../components/Layout/layout";
import Cropper from "../../components/cropper";
import VideoPlayer from "../../components/videoPlayer";
import Box from "../../components/box";

const IndexPage = () => {
  const [crop, setCrop] = useState({
    unit: "%",
    aspect: null,
    x: 0,
    y: 0,
    width: (128 / 1920) * 100,
    height: (128 / 1080) * 100,
  });
  const [disabled, setDisable] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const canvas = <canvas style={{ width: "100%" }} ref={canvasRef} />;
  const videoPlayer = (
    <VideoPlayer
      ref={videoRef}
      onDisableCrop={setDisable}
      onSetCurrentTime={setCurrentTime}
    />
  );
  const ratio = [0, 0, 1920 / 100, 1080 / 100, 1920 / 100, 1080 / 100];

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
              <Box title="Result">{canvas}</Box>
            </Col>
          </Row>
          <Row>
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
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export default IndexPage;
