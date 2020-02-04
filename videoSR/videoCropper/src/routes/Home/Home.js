import React from "react";
import { Row, Col } from "reactstrap";

import Layout from "../../components/Layout/layout";
import home1 from "./home1.png";

import s from "./Home.module.scss";

const Home = () => {
  return (
    <Layout>
      <Row>
        <Col xs={12} md={6}>
          <div className={s.container}>
            <div className={s.magnifyIcon}>
              <i className="ni ni-ambulance" />
            </div>
            <h3>Awesome Super-Resolution Techniques</h3>
            <p>
              Your security camera quality is too low that you can&apos;t read
              what characters is from the video. You want somethings more
              advanced than this, but your wallet doesn&apos;t allow you to do
              it. Our application will do that for you.
            </p>
            <ul className={s.list}>
              <li>
                <span className={s.icon}>
                  <i className="ni ni-image" />
                </span>
                Recover the quality of your video
              </li>
              <li>
                <span className={s.icon}>
                  <i className="ni ni-zoom-split-in" />
                </span>
                Recognize the information from the license plate
              </li>
              <li>
                <span className={s.icon}>
                  <i className="ni ni-collection" />
                </span>
                Manage all videos in the library
              </li>
            </ul>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className={s.container}>
            <div className={s.img}>
              <img src={home1} alt="SR" />
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default Home;
