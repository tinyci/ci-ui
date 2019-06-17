import React from 'react';

import Client from '../../lib/client/client';
import {handleError} from '../error-messages';

import AppBar from '@material-ui/core/AppBar';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SendIcon from '@material-ui/icons/Send';

class SubmitForm extends React.Component {
  client = new Client();
  state = {repository: '', sha: '', submitting: false};
  testAll = false;

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
      <AppBar style={{zIndex: 2}} position="static" color="secondary">
        <form>
          <Grid
            container
            spacing={4}
            style={{
              height: '100%',
            }}>
            <Grid item xs={1}>
              <Typography
                align="center"
                color="textSecondary"
                style={{
                  marginLeft: '0.5em',
                  marginTop: '1em',
                }}>
                Submit a Test
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Repository"
                placeholder="owner/repo"
                onChange={chg => {
                  this.setState({repository: chg.target.value});
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="SHA or Branch"
                placeholder="name or 40 char SHA"
                onChange={chg => {
                  this.setState({sha: chg.target.value});
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <InputLabel
                style={{
                  marginLeft: '0.5em',
                  marginTop: '1em',
                }}>
                Test All
                <Checkbox
                  color="primary"
                  onChange={(e, res) => {
                    this.testAll = res;
                  }}
                />
              </InputLabel>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                disabled={this.state.submitting}
                style={{
                  marginLeft: '0.5em',
                  marginTop: '1em',
                }}
                onClick={this.submit.bind(this)}>
                {this.state.submitting ? <MoreHorizIcon /> : <SendIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </AppBar>
    );
  }
}

export default SubmitForm;
