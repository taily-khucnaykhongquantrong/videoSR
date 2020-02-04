import React from "react";
import { Row, Col, Table, Breadcrumb, BreadcrumbItem } from "reactstrap";

import Layout from "../../components/Layout/layout";
import Box from "../../components/box";
import history from "../../history";
import Link from "../../components/Link";

import s from "./Library.module.scss";
import Button from "../../components/button";

const uploadIcon = <i className="ni ni-cloud-upload-96" />;
const deleteIcon = <i className="ni ni-fat-remove" />;
const selectAllIcon = <i className="ni ni-bullet-list-67" />;

const Library = () => {
  const videoList = JSON.parse(sessionStorage.getItem("videoList"));

  const handleClick = e => {
    const { id } = e.currentTarget;

    if (e.currentTarget !== "_blank") {
      if (e.defaultPrevented === false && e.button === 0) {
        e.preventDefault();
      }
      history.push(`/library/${id}`);
    }
  };

  return (
    <Layout>
      <Row>
        <Col>
          <Breadcrumb className={s.breadcrumbs} tag="nav" listTag="div">
            <BreadcrumbItem>
              <Link className={s.breadItem} to="/">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <Link className={s.breadItem} to="/library">
                Library
              </Link>
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Box title="Video Library">
            <div className={s.buttonBar}>
              <Button>
                <span>Upload {uploadIcon}</span>
              </Button>
              <Button>
                <span>Delete {deleteIcon}</span>
              </Button>
              <Button>
                <span>Select All {selectAllIcon}</span>
              </Button>
            </div>
            <Table className={s.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Total Time</th>
                  <th>FPS</th>
                  <th>Resolution</th>
                </tr>
              </thead>
              <tbody>
                {videoList.map((video, index) => (
                  <tr id={video.name} key={video.name} onClick={handleClick}>
                    <th scope="row">{index + 1}</th>
                    <td>{video.name}</td>
                    <td>{video.totalTime}</td>
                    <td>{video.fps}</td>
                    <td>{`${video.width} x ${video.height}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        </Col>
      </Row>
    </Layout>
  );
};

Library.propTypes = {};

export default Library;
