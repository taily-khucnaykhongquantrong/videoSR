/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";

import Header from "./header";
import s from "./layout.module.scss";

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle="Video Super-Resolution" />
      <Container className={s.body}>{children}</Container>
      <footer className={s.footer}>
        <div>© {new Date().getFullYear()}, Built with ReactJS</div>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
