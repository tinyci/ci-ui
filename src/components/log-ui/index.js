import React from "react";

import Client from "../../lib/client/client";
import {
  handleError,
  handlePlainError,
  ErrorMessages,
} from "../error-messages";
import Breadcrumb from "../breadcrumb";
import RunGrid from "../run-grid";
import Home from "../home";
import muiTheme from "../../muitheme.js";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";

import { Terminal } from "xterm";
import { fit } from "xterm/dist/addons/fit/fit";
import "xterm/dist/xterm.css";

class LogUI extends React.Component {
  run_id = null;
  terminal = null;
  xterm = null;
  client = new Client();
  interval = null;

  state = { run: null };

  refreshRun() {
    this.client.runRunIdGet(this.run_id, (err, run, resp) => {
      if (!handleError(err, resp)) {
        this.setState({ run: run });
      }
    });
  }

  getWSURL() {
    var loc = new URL(document.location);
    if (loc.protocol === "https:") {
      loc.protocol = "wss:";
    } else {
      loc.protocol = "ws:";
    }

    loc.pathname = "/uisvc/log/attach/" + this.run_id;

    return loc.toString();
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
    this.interval = null;
  }

  componentDidMount() {
    this.run_id = Number(this.props.match.params.id);
    this.terminal = document.getElementById("terminal");

    this.refreshRun();
    this.interval = window.setInterval(this.refreshRun.bind(this), 5000);

    if (this.xterm === null) {
      this.xterm = new Terminal();

      this.xterm.open(this.terminal);
      this.xterm.setOption("convertEol", true);

      var ws = new WebSocket(this.getWSURL());

      ws.onmessage = (event) => {
        var parsed = JSON.parse(event.data);
        if (parsed.type === "error") {
          handlePlainError(parsed.payload);
          ws.close();
        }
        this.xterm.write(parsed.payload);
      };

      ws.onerror = (event) => {
        handleError(event);
      };

      ws.onclose = (event) => {
        if (!event.wasClean && event.reason !== "") {
          handlePlainError(event.reason);
        }
      };

      window.addEventListener("resize", () => {
        fit(this.xterm);
      });

      this.terminal.style.height =
        window.innerHeight -
        20 - // two spacer divs wrapping the terminal
        document.getElementById("runbar").offsetHeight +
        "px";

      fit(this.xterm);
    }
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <div id="runbar">
          <AppBar
            style={{
              position: "relative",
              height: "75px",
              overflowY: "hidden",
              borderBottom: "1px solid " + muiTheme.palette.primary.light,
              background: muiTheme.palette.primary.main,
              color: muiTheme.palette.primary.light,
            }}
          >
            <Grid style={{ height: "100%" }} container spacing={0}>
              <Grid item xs={2}>
                <Home />
              </Grid>
              <RunGrid run={this.state.run} size={11} />
            </Grid>
          </AppBar>
          <Breadcrumb
            submission={this.state.run ? this.state.run.task.submission : null}
            path={this.state.run ? this.state.run.task.path : null}
            task_id={this.state.run ? this.state.run.task.id : null}
            run_id={this.state.run ? this.state.run.id : null}
          />
        </div>
        <div style={{ height: "10px", background: "black" }} />
        <div
          id="terminal"
          style={{
            width: "100%",
            background: "black",
            color: "#ccc",
          }}
        />
        <div style={{ height: "10px", background: "black" }} />
        <ErrorMessages />
      </React.Fragment>
    );
  }
}

export default LogUI;
