import React from "react";
import PropTypes from "prop-types";

import ProgressBar from "../progressbar";
import Button from "../button";
import TimeDisplay from "./TimeDisplay";
// import videoSrc from "../../assets/videos/license_plate8_cut.mp4";

import s from "./videoPlayer.module.scss";

const playIcon = <i className="ni ni-button-play" />;
const pauseIcon = <i className="ni ni-button-pause" />;

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleUpdateCurrentTime = this.handleUpdateCurrentTime.bind(this);
  }

  componentDidMount() {
    this.videoRef.current.addEventListener("timeupdate", this.handleUpdateTime);
  }

  componentWillUnmount() {
    this.videoRef.current.removeEventListener(
      "timeupdate",
      this.handleUpdateTime
    );
  }

  handleUpdateTime = ({ target }) => {
    const { currentTime } = target;
    const { onSetCurrentTime } = this.props;

    onSetCurrentTime(currentTime);
  };

  handleButtonClick() {
    const video = this.videoRef.current;
    const { onDisableCrop } = this.props;

    if (video.paused) {
      video.play();
      onDisableCrop(true);
    } else {
      video.pause();
      onDisableCrop(false);
    }
  }

  handleUpdateCurrentTime(currentTime) {
    const video = this.videoRef.current;
    video.currentTime = currentTime.toFixed(6);
  }

  render() {
    const { currentTime = 0, duration = 0, paused = true, ended = true } =
      this.videoRef.current || {};
    const currentProgress = currentTime / duration || 0;
    const buttonIcon = paused || ended ? playIcon : pauseIcon;
    const { src } = this.props;

    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video className={s.video} ref={this.videoRef} muted>
          <source src={src} />
        </video>
        <div className={s.controlsBar}>
          <Button className={s.button} onClick={this.handleButtonClick}>
            <span>{buttonIcon}</span>
          </Button>
          <TimeDisplay currentTime={currentTime} duration={duration} />
          <div className={s.progressBar}>
            <ProgressBar
              duration={duration}
              onUpdateCurrentTime={this.handleUpdateCurrentTime}
              value={currentProgress}
            />
          </div>
        </div>
      </>
    );
  }
}

VideoPlayer.propTypes = {
  onDisableCrop: PropTypes.func.isRequired,
  onSetCurrentTime: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};

export default VideoPlayer;
