import React from "react";
import PropTypes from "prop-types";

import s from "./TimeDisplay.module.scss";

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

const TimeDisplay = ({ currentTime, duration }) => {
  const currentTimestamp = progressToTime(currentTime);
  const durationTimestamp = progressToTime(duration);
  const currentTimeDisplay = displayTime(currentTimestamp);
  const durationDisplay = displayTime(durationTimestamp);

  return (
    <span className={s.timeDisplay}>
      {`${currentTimeDisplay}/${durationDisplay}`}
    </span>
  );
};

TimeDisplay.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

export default TimeDisplay;
