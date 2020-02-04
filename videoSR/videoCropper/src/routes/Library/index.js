import React from "react";
import axios from "axios";

import Library from "./Library";

export default async function action() {
  const videoList = await axios.get("http://localhost:8000/api/videos/");
  sessionStorage.setItem("videoList", JSON.stringify(videoList.data));

  return {
    title: "Library",
    component: <Library />,
  };
}
