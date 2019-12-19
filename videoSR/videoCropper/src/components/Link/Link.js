import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import history from "../../history";
import s from "./Link.module.scss";

export default class Link extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { to, target } = this.props;

    if (target !== "_blank") {
      if (e.defaultPrevented === false && e.button === 0) {
        e.preventDefault();
      }
      history.push(to);
    }
  }

  render() {
    const { children, className, to, target } = this.props;

    return (
      <a
        className={classnames(className, s.link)}
        role="button"
        tabIndex="0"
        onKeyPress={() => {}}
        onClick={this.handleClick}
        href={to}
        target={target}
      >
        {children}
      </a>
    );
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.node,
  target: PropTypes.string,
};

Link.defaultProps = {
  className: "",
  target: "_self",
};
