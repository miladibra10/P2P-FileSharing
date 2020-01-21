import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Home from './scripts/view/pages/Home/index';
import Post from './scripts/view/pages/Post/index';
import Admin from './scripts/view/pages/Admin/index';
import NewPost from './scripts/view/pages/Admin/NewPost'

import "./scripts/view/styles/main.scss"

class App extends React.Component {
  render() {
    const { match } = this.props;
    console.log(this.props)
    return (
      <div>
        <Switch>
        <Route
          exact
          path="/"
          component={() => <Home />}
          />
        {/*
          <Route
            exact
            path="/"
            component={() => <Admin />}
    />
          <Route
            exact
            path="/post/:postID"
            component={() => <Post match={match} />}
          />
          <Route
            exact
            path="/new-post"
            component={() => <NewPost />}
          />

    */}
        </Switch>
      </div>
    );
  }
}

export default connect()(App);
