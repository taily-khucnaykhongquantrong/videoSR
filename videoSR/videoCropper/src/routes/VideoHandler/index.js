import React from "react";

import VideoHandler from "./VideoHandler";

export default function action(context) {
  const { videoName } = context.params;
  const videoList = JSON.parse(sessionStorage.getItem("videoList"));
  const index = videoList.findIndex(x => x.name === videoName);
  const videoInfo = videoList[index];

  return {
    title: videoName,
    component: <VideoHandler videoInfo={videoInfo} />,
  };
}
