import Home from "./Home";
import NotFoundPage from "./404";

const routes = [
  {
    path: "/",
    action: Home,
  },
  {
    path: "(.*)",
    action: NotFoundPage,
  },
];

export default routes;
