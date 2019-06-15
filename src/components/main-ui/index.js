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
import Typography from '@material-ui/core/Typography';

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
    userProperties: {
      username: '',
      capabilities: [],
    },
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
      this.client.repositoriesSubscribedGet({}, (err, subscribed, resp) => {
        if (!handleError(err, resp)) {
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
    this.client.userPropertiesGet((err, elem, resp) => {
      if (!handleError(err, resp)) {
        this.setState({userProperties: elem});
      }
    });

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
            {this.state.userProperties.capabilities &&
            this.state.userProperties.capabilities.includes('submit') ? (
              <Grid item xs={1}>
                <div style={{height: '100%'}}>
                  <Button
                    size="large"
                    style={{height: 'inherit'}}
                    onClick={this.handleSubmitSelect.bind(this)}>
                    <PublishIcon />
                    Submit
                  </Button>
                </div>
              </Grid>
            ) : (
              <Grid item xs={1} />
            )}
            <Grid item xs={6} />
            <Grid item xs={1}>
              <Box
                style={{
                  height: '100%',
                  padding: '1em',
                  textAlign: 'center',
                }}>
                <Typography>{this.state.userProperties.username}</Typography>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <div style={{height: '100%'}}>
                <Tooltip title="Home">
                  <a href={'/'}>
                    <img
                      alt="logo"
                      style={{
                        height: '32px',
                        marginTop: '8px',
                      }}
                      src="/logo-reverse-title.png"
                    />
                  </a>
                </Tooltip>
              </div>
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
