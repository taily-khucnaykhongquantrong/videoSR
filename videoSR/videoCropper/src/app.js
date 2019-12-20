import ReactDOM from "react-dom";
import UniversalRouter from "universal-router";
// import axios from 'axios';

import routes from "./routes";
import history from "./history";
// import GLOBAL from './GLOBAL';

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/css/argon-design-system-react.min.css";
import "./assets/styles/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/styles/vendor/nucleo/css/nucleo.css";
// import './GlobalStyle.scss';

const container = document.getElementById("app");
const options = {
  // Customize the way to resolve route
  resolveRoute(context, params) {
    if (typeof context.route.action === "function") {
      return context.route.action(context, params);
    }
    return undefined;
  },
};
const router = new UniversalRouter(routes, options);

const renderRoutes = ({ title, component }) => {
  ReactDOM.render(component, container, () => {
    document.title = title;
  });
};

const render = location => {
  router
    .resolve({ pathname: location.pathname })
    .then(result => {
      if (result.redirect) {
        history.replace(result.redirect);
      } else {
        renderRoutes(result);
      }
    })
    .catch(error => console.error(error));
};

render(history.location);
history.listen(render);

// const url = `${GLOBAL.BASE_URL}/api/siteInfo/get`;

// axios.get(url).then(async response => {
//   await localStorage.setItem('siteInfo', JSON.stringify(response.data.data));

//   render(history.location);
//   history.listen(render);
// });
