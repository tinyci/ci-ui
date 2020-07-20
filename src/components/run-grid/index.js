import React from 'react';

import * as format from '../../lib/table-formatters';
import muiTheme from '../../muitheme.js';

import {handleError} from '../error-messages';
import {TopButton} from '../top-button';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const StatusLabel = props => {
  return (
    <Box
      style={{
        borderRight: '1px solid ' + muiTheme.palette.primary.light,
        height: '100%',
      }}>
      <center>
        <Button
          disabled
          size="small"
          variant="outlined"
          style={{
            marginTop: '1em',
            border: '1px solid ' + props.borderColor,
            color: props.color,
          }}>
          {props.text}
        </Button>
      </center>
    </Box>
  );
};

class RunGrid extends React.Component {
  formatStatus(status) {
    if (status === undefined || status === null) {
      return (
        <StatusLabel
          borderColor={grey[200]}
          color={grey[100]}
          text="Unfinished"
        />
      );
    }

    if (status) {
      return (
        <StatusLabel
          borderColor={green[600]}
          color={green[700]}
          text="Success"
        />
      );
    }

    return (
      <StatusLabel borderColor={red[200]} color={red[100]} text="Failure" />
    );
  }

  render() {
    var refURL, refText;

    if (this.props.run && this.props.run.task.pull_request_id) {
      refURL =
        this.props.run.task.submission.base_ref.repository.github.html_url +
        '/pull/' +
        this.props.run.task.pull_request_id;
      refText = this.props.run.task.pull_request_id;
    }

    if (this.props.run && !this.props.run.started_at) {
      handleError({message: 'Run has not started'}, {});
    }

    return (
      <React.Fragment>
        {this.props.run ? (
          <React.Fragment>
            {refURL && refText ? (
              <Grid item xs={1}>
                <Box
                  style={{height: '100%', paddingLeft: '1em', margin: 'auto'}}>
                  <TopButton
                    flavor={
                      <React.Fragment>
                        <Box style={{height: '100%', margin: 'auto'}}>
                          <Button
                            size="small"
                            href={refURL}
                            variant="contained">
                            PR #{refText}
                          </Button>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </Box>
              </Grid>
            ) : null}
            <Grid item xs={1}>
              {this.formatStatus(this.props.run.status)}
            </Grid>
            <Grid item xs={2}>
              <Box style={{height: '100%', margin: 'auto'}}>
                <TopButton
                  flavor={
                    <React.Fragment>
                      <Typography variant="subtitle2">
                        <b>
                          {
                            this.props.run.task.submission.base_ref.repository
                              .name
                          }
                        </b>
                      </Typography>
                      {this.props.run.task.submission.base_ref.repository.id !==
                        this.props.run.task.submission.head_ref.repository.id &&
                      this.props.run.task.submission.base_ref.repository
                        .name !==
                        this.props.run.task.submission.head_ref.repository
                          .name ? (
                        <Typography>
                          (fork of{' '}
                          {
                            this.props.run.task.submission.base_ref.repository
                              .name
                          }
                          )
                        </Typography>
                      ) : (
                        ''
                      )}
                    </React.Fragment>
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <TopButton
                nopad
                flavor={
                  <Box style={{marginLeft: '3em'}}>
                    <Typography variant="subtitle2">
                      Test: <b>{this.props.run.name}</b>
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TopButton nopad
                flavor={format.ref({
                  value: this.props.run.task.submission.head_ref,
                })}
              />
            </Grid>
            <Grid item xs={2}>
              <Box
                style={{
                  height: '100%',
                  marginLeft: '3em',
                  marginTop: '0.5em',
                }}>
                {format.history({value: this.props.run})}
              </Box>
            </Grid>
            <Grid item xs={this.props.size - 10} />
          </React.Fragment>
        ) : (
          <Grid item xs={this.props.size} />
        )}
      </React.Fragment>
    );
  }
}

export default RunGrid;
