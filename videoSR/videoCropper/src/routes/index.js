import Home from "./Home";
import NotFoundPage from "./404";
import Library from "./Library";
import VideoHandler from "./VideoHandler";

const routes = [
  {
    path: "/",
    action: Home,
  },
  {
    path: "/library",
    children: [
      {
        path: "",
        action: Library,
      },
      {
        path: "/:videoName",
        action: VideoHandler,
      },
    ],
  },
  {
    path: "(.*)",
    action: NotFoundPage,
  },
];

export default routes;
