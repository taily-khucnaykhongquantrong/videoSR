import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "reactstrap";
import classnames from "classnames";

import s from "./Box.module.scss";

const Box = ({ className, children, title }) => {
  return (
    <Card className={classnames(s.box, className)}>
      <CardBody>
        <h4>{title}</h4>
        {children}
      </CardBody>
    </Card>
  );
};

Box.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
};

Box.defaultProps = {
  className: null,
  children: null,
  title: "",
};

export default Box;
