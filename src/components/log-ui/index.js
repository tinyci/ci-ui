import React from 'react';

import {handleError, handlePlainError, ErrorMessages} from '../error-messages';
import RunGrid from '../run-grid';
import Home from '../home';
import muiTheme from '../../muitheme.js';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import {Terminal} from 'xterm';
import {fit} from 'xterm/dist/addons/fit/fit';
import 'xterm/dist/xterm.css';

const barHeight = 60;

class LogUI extends React.Component {
  run_id = null;
  terminal = null;
  xterm = null;

  getWSURL() {
    var loc = new URL(document.location);
    if (loc.protocol === 'https:') {
      loc.protocol = 'wss:';
    } else {
      loc.protocol = 'ws:';
    }

    loc.pathname = '/uisvc/log/attach/' + this.run_id;

    return loc.toString();
  }

  componentDidMount() {
    this.run_id = Number(this.props.match.params.id);
    this.terminal = document.getElementById('terminal');

    if (this.xterm === null) {
      this.xterm = new Terminal();

      this.xterm.open(this.terminal);
      this.xterm.setOption('convertEol', true);

      var ws = new WebSocket(this.getWSURL());

      ws.onmessage = event => {
        var parsed = JSON.parse(event.data);
        if (parsed.type === 'error') {
          handlePlainError(parsed.payload);
          ws.close();
        }
        this.xterm.write(parsed.payload);
      };

      ws.onerror = event => {
        handleError(event);
      };

      ws.onclose = event => {
        if (!event.wasClean && event.reason !== '') {
          handlePlainError(event.reason);
        }
      };

      window.addEventListener('resize', () => {
        fit(this.xterm);
      });
      fit(this.xterm);
    }
  }

  render() {
    return (
      <Box>
        <CssBaseline />
        <AppBar
          position="static"
          style={{
            borderBottom: '1px solid ' + muiTheme.palette.primary.light,
            background: muiTheme.palette.primary.main,
            color: muiTheme.palette.primary.light,
            height: barHeight + 'px',
          }}>
          <Grid style={{height: '100%'}} container spacing={0}>
            <Grid item xs={2}>
              <Home />
            </Grid>
            <RunGrid run_id={this.props.match.params.id} size={11} />
          </Grid>
        </AppBar>
        <div
          id="terminal"
          style={{
            width: '100%',
            height: window.innerHeight - barHeight + 'px',
            right: 0,
            margin: 0,
            padding: 0,
            background: 'black',
            color: '#ccc',
          }}
        />
        <ErrorMessages />
      </Box>
    );
  }
}

export default LogUI;
