import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Button } from "reactstrap";

import s from "./button.module.scss";

const CustomButton = props => {
  const { className, children, value, onClick } = props;
  return (
    <Button
      className={classnames(className, s.button)}
      color="primary"
      type="button"
      onClick={onClick}
    >
      {children || value}
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  value: PropTypes.string,
};

CustomButton.defaultProps = {
  children: null,
  className: "",
  onClick: () => {},
  value: "",
};

export default CustomButton;
