import React from "react";
import axios from "axios";

import Library from "./Library";

export default async function action() {
  const videoInfo = await axios.get("http://localhost:8000/api/videos/");

  return {
    title: "Library",
    component: <Library videoInfo={videoInfo.data[0]} />,
  };
}
