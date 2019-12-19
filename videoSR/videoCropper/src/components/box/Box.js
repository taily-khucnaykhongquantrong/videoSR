import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "reactstrap";

import s from "./Box.module.scss";

const Box = ({ children, title }) => {
  return (
    <Card className={s.box}>
      <CardBody>
        <h4>{title}</h4>
        {children}
      </CardBody>
    </Card>
  );
};

Box.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

Box.defaultProps = {
  children: null,
  title: "",
};

export default Box;
