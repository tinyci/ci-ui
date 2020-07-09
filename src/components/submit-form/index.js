import React from 'react';

import Client from '../../lib/client/client';
import {handleError} from '../error-messages';
import muiTheme from '../../muitheme.js';

import {withStyles} from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SendIcon from '@material-ui/icons/Send';

const Field = withStyles({
  root: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    '& label.MuiFormLabel-root': {
      color: muiTheme.palette.secondary.light,
      marginTop: '1em',
    },
    '& input.MuiInputBase-input': {
      color: muiTheme.palette.primary.contrastText,
      marginTop: '1em',
    },
    '& div.MuiInput-root': {
      marginRight: '1em',
    },
  },
})(TextField);

class SubmitForm extends React.Component {
  client = new Client();
  state = {repository: '', sha: '', submitting: false};
  testAll = false;

  componentDidMount() {
    document.getElementById('repository').focus();
  }

  submit() {
    this.setState({submitting: true});
    this.client.submitGet(
      this.state.repository,
      this.state.sha,
      {all: this.testAll},
      (err, _, resp) => {
        handleError(err, resp);
        this.setState({submitting: false});
      },
    );
  }

  render() {
    return (
      <div
        style={{
          border: '1px solid ' + muiTheme.palette.primary.light,
          width: window.innerWidth,
          backgroundColor: muiTheme.palette.primary.main,
          margin: 0,
          padding: 0,
          height: '6em',
          position: 'absolute',
          zIndex: 65535,
        }}
        position="static">
        <form>
          <Grid
            container
            style={{
              height: '100%',
            }}>
            <Grid item xs={2}>
              <Typography
                align="center"
                style={{
                  color: muiTheme.palette.primary.contrastText,
                  marginLeft: '0.5em',
                  marginTop: '1.5em',
                }}>
                Submit a Test
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Field
                id="repository"
                required
                label="Repository"
                placeholder="owner/repo"
                onChange={chg => {
                  this.setState({repository: chg.target.value});
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Field
                required
                label="SHA or Branch"
                placeholder="name or 40 char SHA"
                onChange={chg => {
                  this.setState({sha: chg.target.value});
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <div
                style={{
                  height: '100%',
                  marginTop: '1em',
                  marginBottom: '1em',
                }}>
                <InputLabel
                  style={{
                    color: muiTheme.palette.secondary.light,
                    marginTop: '1em',
                  }}>
                  Test All
                </InputLabel>
                <Checkbox
                  style={{
                    color: muiTheme.palette.secondary.light,
                  }}
                  onChange={(e, res) => {
                    this.testAll = res;
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={1}>
              <div
                style={{
                  height: '100%',
                  marginTop: '1em',
                  marginBottom: '1em',
                }}>
                <IconButton
                  disabled={this.state.submitting}
                  style={{
                    color: muiTheme.palette.secondary.light,
                  }}
                  onClick={this.submit.bind(this)}>
                  {this.state.submitting ? <MoreHorizIcon /> : <SendIcon />}
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default SubmitForm;
