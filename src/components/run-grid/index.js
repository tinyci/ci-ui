import React from 'react';

import Client from '../../lib/client/client';
import * as format from '../../lib/table-formatters';

import {handleError} from '../error-messages';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const StatusLabel = props => {
  return (
    <Button
      disabled
      variant="outlined"
      style={{
        border: '1px solid ' + props.borderColor,
        color: props.color,
      }}>
      {props.text}
    </Button>
  );
};

class RunGrid extends React.Component {
  state = {run: null};
  client = new Client();
  interval = null;

  refreshRun() {
    this.client.runRunIdGet(this.props.run_id, (err, run, resp) => {
      if (!handleError(err, resp)) {
        this.setState({run: run});
      }
    });
  }

  formatStatus(status) {
    if (status === undefined || status === null) {
      return (
        <StatusLabel
          borderColor={grey[800]}
          color={grey[900]}
          text="Unfinished"
        />
      );
    }

    if (status) {
      return (
        <StatusLabel
          borderColor={green[800]}
          color={green[900]}
          text="Success"
        />
      );
    }

    return (
      <StatusLabel borderColor={red[800]} color={red[900]} text="Failure" />
    );
  }

  componentDidMount() {
    this.refreshRun();
    this.interval = window.setInterval(this.refreshRun.bind(this), 5000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
    this.interval = null;
  }

  render() {
    var refURL, refText;

    if (this.state.run && this.state.run.task.pull_request_id) {
      refURL =
        this.state.run.task.parent.github.html_url +
        '/pull/' +
        this.state.run.task.pull_request_id;
      refText = this.state.run.task.pull_request_id;
    }

    if (this.state.run && !this.state.run.started_at) {
      handleError({message: 'Run has not started'}, {});
    }

    return (
      <React.Fragment>
        {this.state.run ? (
          <React.Fragment>
            <Grid item xs={1}>
              <Box style={{height: '100%', paddingLeft: '1em', margin: 'auto'}}>
                <Typography>Run ID: {this.props.run_id}</Typography>
              </Box>
            </Grid>
            <Grid item xs={1}>
              {this.formatStatus(this.state.run.status)}
            </Grid>
            <Grid item xs={1}>
              <Box style={{height: '100%', margin: 'auto'}}>
                {format.history({value: this.state.run})}
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box style={{height: '100%', margin: 'auto'}}>
                {format.ref({value: this.state.run.task.ref})}
              </Box>
            </Grid>
            <Grid item xs={1}>
              {refURL && refText ? (
                <Box style={{height: '100%', margin: 'auto'}}>
                  <Button href={refURL}>{refText}</Button>
                </Box>
              ) : (
                ''
              )}
            </Grid>
            <Grid item xs={this.props.size - 6} />
          </React.Fragment>
        ) : (
          <Grid item xs={this.props.size} />
        )}
      </React.Fragment>
    );
  }
}

export default RunGrid;
