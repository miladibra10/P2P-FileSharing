import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Home from './scripts/view/pages/Home/index';
import {util} from './scripts/core/webrtc/peer';
import initialize from "./scripts/core/webrtc/initialize";
import "./scripts/view/styles/main.scss"

class App extends React.Component {
  render() {
    const { match } = this.props;
    initialize.initialize();

    return (
      <div>
        <Switch>
            <Route
                exact
                path="/"
                component={() => <Home/>}
            />

        </Switch>
      </div>
    );
  }
}

export default connect()(App);
