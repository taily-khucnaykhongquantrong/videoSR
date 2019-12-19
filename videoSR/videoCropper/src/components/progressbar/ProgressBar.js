import React, { useRef } from "react";
import PropTypes from "prop-types";

import s from "./ProgressBar.module.scss";

const ProgressBar = ({ duration, onUpdateCurrentTime, value }) => {
  const progressbarRef = useRef(null);
  const containerRef = useRef(null);

  const handleClick = event => {
    const { pageX, target } = event;

    // Get current position
    const bound = target.getBoundingClientRect();
    const left = pageX - (bound.left + document.body.scrollLeft);
    const totalWidth = containerRef.current.offsetWidth;
    const percentage = left / totalWidth;

    // Update video current time
    progressbarRef.current.style.width = `${percentage * 100}%`;
    onUpdateCurrentTime(percentage * duration);
  };

  const percentage = value * 100;

  return (
    <div
      className={s.container}
      onClick={handleClick}
      ref={containerRef}
      role="button"
      tabIndex="-1"
      onKeyDown={() => {}}
    >
      <span ref={progressbarRef} style={{ width: `${percentage}%` }} />
    </div>
  );
};

ProgressBar.propTypes = {
  duration: PropTypes.number.isRequired,
  onUpdateCurrentTime: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default ProgressBar;
