import React from "react";
import PropTypes from "prop-types";

import ProgressBar from "../progressbar";
import Button from "../button";
import videoSrc from "../../assets/videos/license_plate6.mp4";

import s from "./videoPlayer.module.scss";

const progressToTime = progress => {
  const hour = Math.floor(progress / 3600);
  const minute = Math.floor((progress % 3600) / 60);
  const second = Math.floor((progress % 3600) % 60);

  return { hour, minute, second };
};

const displayTime = ({ hour, minute, second }) => {
  let hourDisplay = "";
  const minuteDisplay = minute;
  let secondDisplay = `0${second}`;

  if (hour > 0 && hour < 10) {
    hourDisplay = `0${hour}`;
  } else if (hour > 10) {
    hourDisplay = hour;
  }

  if (second >= 10) {
    secondDisplay = second;
  }

  return hour === 0
    ? `${minuteDisplay}:${secondDisplay}`
    : `${hourDisplay}:${minuteDisplay}:${secondDisplay}`;
};

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
    video.currentTime = currentTime;
  }

  render() {
    const { currentTime = 0, duration = 0, paused = true, ended = true } =
      this.videoRef.current || {};
    const currentProgress = currentTime / duration || 0;
    const currentTimestamp = progressToTime(currentTime);
    const durationTimestamp = progressToTime(duration);
    const currentTimeDisplay = displayTime(currentTimestamp);
    const durationDisplay = displayTime(durationTimestamp);
    const buttonIcon = paused || ended ? playIcon : pauseIcon;

    return (
      <>
        {/* eslint-disable-next-line */}
        <video className={s.video} ref={this.videoRef}>
          <source src={videoSrc} />
        </video>
        <div className={s.controlsBar}>
          <Button className={s.button} onClick={this.handleButtonClick}>
            <span>{buttonIcon}</span>
          </Button>
          <span className={s.timeDisplay}>
            {`${currentTimeDisplay}/${durationDisplay}`}
          </span>
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
};

export default VideoPlayer;
