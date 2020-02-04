import React from "react";
import PropTypes from "prop-types";

import s from "./Modal.module.scss";

const Modal = ({ text, onClick }) => {
  return (
    <div
      role="button"
      tabIndex="-1"
      onKeyDown={() => {}}
      onClick={onClick}
      className={s.background}
    >
      <div className={s.modal}>
        <h3 className={s.title}>Recognized Texts</h3>
        <h3 className={s.innerText}>{text}</h3>
      </div>
    </div>
  );
};

Modal.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

Modal.defaultProps = {
  text: "",
  onClick: () => {},
};

export default Modal;
