import React from 'react';

import Client from '../../lib/client/client';

import {ErrorMessages, handleError} from '../error-messages';
import RunList from '../run-list';
import TaskList from '../task-list';
import SubmitForm from '../submit-form';
import SubscribedList from '../subscribed-list';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import PublishIcon from '@material-ui/icons/Publish';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const minWidth = 1080; // optimize for 1080p

class MainUI extends React.Component {
  flavor = 'task';
  state = {
    subscribed: [],
    submitDrawerOpen: false,
    listDrawerOpen: false,
    rerender: 0,
  };
  client = new Client();

  handleSubmitSelect() {
    this.setState({
      listDrawerOpen: false,
      submitDrawerOpen: !this.state.submitDrawerOpen,
    });
  }

  submitClickAwayHandler() {
    this.setState({submitDrawerOpen: false});
  }

  drawerClickAwayHandler() {
    this.setState({listDrawerOpen: false});
  }

  handleRepositorySelect(listDrawerOpen) {
    if (listDrawerOpen) {
      this.client.repositoriesSubscribedGet({}, (err, subscribed) => {
        if (!handleError(err)) {
          subscribed = [{all: true, name: 'All Repositories'}].concat(
            subscribed,
          );
          this.setState({
            subscribed: subscribed,
            listDrawerOpen: listDrawerOpen,
            submitDrawerOpen: false,
          });
        }
      });
    } else {
      this.setState({listDrawerOpen: listDrawerOpen});
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({rerender: this.state.rerender + 1});
    });

    window.addEventListener('popstate', event => {
      document.location.reload();
    });
  }

  render() {
    var repoName = 'All Repositories';
    var owner = this.props.match.params.owner;
    var repository = this.props.match.params.repository;
    var sha = this.props.match.params.sha;
    var task_id = this.props.match.params.task_id;

    if (owner && repository) {
      repoName = owner + '/' + repository;
    }

    var thisMinWidth =
      window.innerWidth < minWidth ? minWidth : window.innerWidth;

    return (
      <Box style={{minWidth: thisMinWidth}}>
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
            <Grid item xs={7} />
            <Grid item xs={1}>
              <Tooltip title="Home">
                <a href={'/'}>
                  <img
                    alt="logo"
                    style={{marginTop: '4px', height: '32px'}}
                    src="/logo-reverse-title.png"
                  />
                </a>
              </Tooltip>
            </Grid>
          </Grid>
        </AppBar>

        {this.state.submitDrawerOpen ? (
          <ClickAwayListener
            onClickAway={this.submitClickAwayHandler.bind(this)}>
            <SubmitForm />
          </ClickAwayListener>
        ) : (
          ''
        )}

        {this.state.listDrawerOpen ? (
          <ClickAwayListener
            onClickAway={this.drawerClickAwayHandler.bind(this)}>
            <SubscribedList subscribed={this.state.subscribed} />
          </ClickAwayListener>
        ) : (
          ''
        )}

        {this.flavor === 'task' ? (
          <TaskList
            minWidth={thisMinWidth}
            owner={owner}
            repository={repository}
            sha={sha}
          />
        ) : (
          <RunList minWidth={thisMinWidth} task_id={task_id} />
        )}

        <ErrorMessages />
      </Box>
    );
  }
}

class TaskUI extends MainUI {
  constructor() {
    super();
    this.flavor = 'task';
  }
}

class RunUI extends MainUI {
  constructor() {
    super();
    this.flavor = 'run';
  }
}

export {TaskUI, RunUI};
