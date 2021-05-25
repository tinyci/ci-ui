import React from "react";
import Client from "./lib/client/client";
import muiTheme from "./muitheme.js";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { handleError } from "./components/error-messages";
import Loading from "./components/loading";
import LoginGateway from "./components/login-gateway";
import LogUI from "./components/log-ui";
import {
  SubmissionRunUI,
  SubmissionUI,
  TaskUI,
  RunUI,
} from "./components/main-ui";

import "./App.css";

class App extends React.Component {
  state = { loggedIn: null };
  client = new Client();
  interval = null;

  checkLogin() {
    this.client.loggedinGet((err, loggedIn) => {
      if (!handleError(err)) {
        this.setState({ loggedIn: loggedIn });
      }
    });
  }

  componentDidMount() {
    this.interval = window.setInterval(this.checkLogin.bind(this), 1000);
    this.checkLogin();
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    if (!this.state.loggedIn) {
      return <Loading />;
    } else if (this.state.loggedIn === "true") {
      return (
        <MuiThemeProvider theme={muiTheme}>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <Router>
            <Route exact path="/log/:id" component={LogUI} />
            <Route path="/runs/:task_id" exact component={RunUI} />
            <Route path="/tasks/:submission_id" exact component={TaskUI} />
            <Route
              path="/submission/:submission_id/runs"
              exact
              component={SubmissionRunUI}
            />
            <Route
              path="/submissions/:owner/:repository/:sha"
              exact
              component={SubmissionUI}
            />
            <Route
              path="/submissions/:owner/:repository"
              exact
              component={SubmissionUI}
            />
            <Route path="/" exact component={SubmissionUI} />
          </Router>
        </MuiThemeProvider>
      );
    } else if (this.state.loggedIn !== "true") {
      return <LoginGateway loginURL={this.state.loggedIn} />;
    }
  }
}

export default App;
