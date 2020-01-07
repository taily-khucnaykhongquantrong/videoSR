import Home from "./Home";
import NotFoundPage from "./404";
import Library from "./Library";

const routes = [
  {
    path: "/",
    action: Home,
  },
  {
    path: "/library",
    action: Library,
  },
  {
    path: "(.*)",
    action: NotFoundPage,
  },
];

export default routes;
