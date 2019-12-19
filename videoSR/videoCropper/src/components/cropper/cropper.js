import React from "react";
import PropTypes from "prop-types";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import s from "./cropper.module.scss";

class Cropper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      crop: {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        ratio: 1,
      },
    };

    this.onCropChange = this.onCropChange.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);

    this.getCroppedImg = this.getCroppedImg.bind(this);
    this.makeClientCrop = this.makeClientCrop.bind(this);
  }

  componentDidMount() {
    const { videoPlayer } = this.props;
    // videoPlayer is a component consisting of many ref
    const videoComponent = videoPlayer.current.videoRef.current;
    const width = (128 * videoComponent.offsetWidth) / 1920;
    const height = (128 * videoComponent.offsetHeight) / 1080;

    console.info(width, height);

    this.setState({ crop: { x: 0, y: 0, width, height } });
  }

  onCropComplete(_, percentCrop) {
    const { onCropDone } = this.props;
    this.makeClientCrop(percentCrop);
    onCropDone(percentCrop);
  }

  onCropChange(percentCrop) {
    this.setState({ crop: percentCrop });
  }

  getCroppedImg(src, crop) {
    const { croppedImgRef } = this.props;
    const percentToPixel = (percent, oriSize) => (percent * oriSize) / 100;

    const canvas = croppedImgRef.current;
    const scaleX = src.videoWidth / src.clientWidth;
    const scaleY = src.videoHeight / src.clientHeight;
    const cropWidthInPixel = percentToPixel(crop.width, src.clientWidth);
    const cropHeightInPixel = percentToPixel(crop.height, src.clientHeight);
    const cropXinPixel = percentToPixel(crop.x, src.clientWidth);
    const cropYinPixel = percentToPixel(crop.y, src.clientHeight);
    const ctx = canvas.getContext("2d");

    const ratio = cropWidthInPixel / cropHeightInPixel;
    canvas.height = canvas.width / ratio;

    ctx.drawImage(
      src,
      cropXinPixel * scaleX,
      cropYinPixel * scaleY,
      cropWidthInPixel * scaleX,
      cropHeightInPixel * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  makeClientCrop(crop) {
    const { videoPlayer } = this.props;
    // videoPlayer is a component consisting of many ref
    const videoSrc = videoPlayer.current.videoRef.current;

    if (videoSrc && crop.width && crop.height) {
      this.getCroppedImg(videoSrc, crop);
    }
  }

  render() {
    const { crop } = this.state;
    const { disabled, renderComponent, src } = this.props;

    return (
      <ReactCrop
        className={s.ReactCrop}
        crop={crop}
        disabled={disabled}
        onChange={this.onCropChange}
        onComplete={this.onCropComplete}
        renderComponent={renderComponent}
        src={src}
      />
    );
  }
}

Cropper.propTypes = {
  croppedImgRef: PropTypes.objectOf(PropTypes.objectOf(PropTypes.object)),
  disabled: PropTypes.bool.isRequired,
  onCropDone: PropTypes.func.isRequired,
  src: PropTypes.string,
  renderComponent: PropTypes.node,
  videoPlayer: PropTypes.objectOf(PropTypes.object).isRequired,
};

Cropper.defaultProps = {
  croppedImgRef: null,
  src: "",
  renderComponent: null,
};

export default Cropper;
