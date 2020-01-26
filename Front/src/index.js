import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Store from "./scripts/core/store";
import { Provider } from "react-redux";

const Router = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
const store = Store();
const RootComponent = (
  <Provider store={store}>
      {Router}
  </Provider>
);
ReactDOM.render(RootComponent, document.getElementById("root"));
