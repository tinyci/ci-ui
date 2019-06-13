import React from 'react';

import Client from '../../lib/client/client';

import TaskList from '../task-list';
import SubmitForm from '../submit-form';
import SubscribedList from '../subscribed-list';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import PublishIcon from '@material-ui/icons/Publish';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

class MainUI extends React.Component {
  state = {
    subscribed: [],
    submitDrawerOpen: false,
    listDrawerOpen: false,
  };
  client = new Client();

  handleSubmitSelect() {
    this.setState({
      listDrawerOpen: false,
      submitDrawerOpen: !this.state.submitDrawerOpen,
    });
  }

  handleRepositorySelect(listDrawerOpen) {
    if (listDrawerOpen) {
      this.client.repositoriesSubscribedGet({}, (err, subscribed) => {
        subscribed = [{all: true, name: 'All Repositories'}].concat(subscribed);
        this.setState({
          subscribed: subscribed,
          listDrawerOpen: listDrawerOpen,
          submitDrawerOpen: false,
        });
      });
    } else {
      this.setState({listDrawerOpen: listDrawerOpen});
    }
  }

  render() {
    var repoName = 'All Repositories';
    var owner = this.props.match.params.owner;
    var repository = this.props.match.params.repository;

    if (owner && repository) {
      repoName = owner + '/' + repository;
    }

    return (
      <Box>
        <CssBaseline />
        <AppBar position="static" color="primary">
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <div style={{height: '100%'}}>
                <Button
                  style={{height: 'inherit'}}
                  size="large"
                  onClick={this.handleRepositorySelect.bind(
                    this,
                    !this.state.listDrawerOpen,
                  )}>
                  <KeyboardArrowDownIcon />
                  {repoName}
                </Button>
              </div>
            </Grid>
            <Grid item xs={1}>
              <Button size="large" onClick={this.handleSubmitSelect.bind(this)}>
                <PublishIcon />
                Submit
              </Button>
            </Grid>
          </Grid>
        </AppBar>
        {this.state.submitDrawerOpen ? <SubmitForm /> : ''}

        {this.state.listDrawerOpen ? (
          <SubscribedList subscribed={this.state.subscribed} />
        ) : (
          ''
        )}

        <TaskList owner={owner} repository={repository} />
      </Box>
    );
  }
}

export default MainUI;
