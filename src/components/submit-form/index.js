import React from 'react';

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
  state = {submitting: false};
  testAll = false;

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
              <TextField label="Repository" placeholder="owner/repo" />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="SHA or Branch"
                placeholder="name or 40 char SHA"
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
                  color="inherit"
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
                }}>
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
