import PropTypes from "prop-types";
import React from "react";

import Link from "../Link";

import s from "./header.module.scss";

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `white`,
      marginBottom: `1.45rem`,
      boxShadow: "0 15px 35px rgba(50,50,93,.05),0 5px 15px rgba(0,0,0,.03)",
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        display: `flex`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `black`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <div className={s.navigation}>
        <Link to="/">Home</Link>
        <Link to="/library">Library</Link>
        <Link to="/about">About</Link>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
