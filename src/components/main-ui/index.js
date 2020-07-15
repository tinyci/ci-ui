import React from 'react';

import Client from '../../lib/client/client';

import AddToCI from '../add-to-ci';
import {ErrorMessages, handleError} from '../error-messages';
import SubmissionList from '../submission-list';
import SubmissionRunList from '../submission-run-list';
import RunList from '../run-list';
import TaskList from '../task-list';
import SidePanel from '../side-panel';
import SubmitForm from '../submit-form';
import SubscribedList from '../subscribed-list';
import Home from '../home';
import {TopButton} from '../top-button';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import PublishIcon from '@material-ui/icons/Publish';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const minWidth = 1080; // optimize for 1080p

class MainUI extends React.Component {
  flavor = 'task';
  state = {
    subscribed: [],
    submitDrawerOpen: false,
    listDrawerOpen: false,
    addDrawerOpen: false,
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
      addDrawerOpen: false,
    });
  }

  handleAddSelect() {
    this.setState({
      addDrawerOpen: true,
      submitDrawerOpen: false,
      listDrawerOpen: false,
    });
  }

  addClickAwayHandler() {
    this.setState({addDrawerOpen: false});
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
            addDrawerOpen: false,
          });
        }
      });
    } else {
      this.setState({listDrawerOpen: listDrawerOpen});
    }
  }

  hasCapability(cap) {
    return (
      this.state.userProperties.capabilities &&
      this.state.userProperties.capabilities.includes(cap)
    );
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
    var submission_id = this.props.match.params.submission_id;

    if (owner && repository) {
      repoName = owner + '/' + repository;
    }

    var thisMinWidth =
      window.innerWidth < minWidth ? minWidth : window.innerWidth;
    thisMinWidth -= 20;

    var list;

    switch (this.flavor) {
      case 'task': {
        list = <TaskList minWidth={thisMinWidth} id={submission_id} />;
        break;
      }
      case 'run': {
        list = <RunList minWidth={thisMinWidth} id={task_id} />;
        break;
      }
      case 'submission_run': {
        list = <SubmissionRunList minWidth={thisMinWidth} id={submission_id} />;
        break;
      }
      default: {
        list = (
          <SubmissionList
            owner={owner}
            repository={repository}
            sha={sha}
            minWidth={thisMinWidth}
          />
        );
        break;
      }
    }

    return (
      <Box style={{minWidth: thisMinWidth}}>
        <CssBaseline />
        <AppBar style={{height: '60px'}} position="static">
          <Grid container style={{height: '100%'}} spacing={0} justify="space-between">
            <Grid item xs={1} alignContent="center">
              <Home />
            </Grid>
            <Grid item xs={2}>
              <TopButton
                flavor={repoName}
                icon={<KeyboardArrowDownIcon />}
                onClick={this.handleRepositorySelect.bind(
                  this,
                  !this.state.listDrawerOpen,
                )}
              />
            </Grid>
            {this.hasCapability('submit') ? (
              <Grid item xs={2}>
                <TopButton
                  onClick={this.handleSubmitSelect.bind(this)}
                  icon={<PublishIcon />}
                  flavor="Submit"
                />
              </Grid>
            ) : (
              <Grid item xs={2} />
            )}
            <Grid item xs={2}>
              {this.hasCapability('modify:ci') ? (
                <TopButton
                  onClick={this.handleAddSelect.bind(this)}
                  icon={<AddIcon />}
                  flavor="Add to CI"
                />
              ) : (
                <Grid item xs={2} />
              )}
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={1}>
              <Box
                style={{
                  float: 'right',
                  marginTop: '8px',
                  marginRight: '0px',
                  height: '100%',
                }}>
                <Typography variant="h5">
                  {this.state.userProperties.username}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={1} alignContent="center" style={{paddingRight: 10}}>
              <Box
                style={{
                  float: 'right',
                  marginRight: '10px',
                  height: '100%',
                }}>
                <SidePanel />
              </Box>
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
            <SubscribedList mainui={this} />
          </ClickAwayListener>
        ) : (
          ''
        )}

        {this.state.addDrawerOpen ? (
          <ClickAwayListener onClickAway={this.addClickAwayHandler.bind(this)}>
            <AddToCI />
          </ClickAwayListener>
        ) : (
          ''
        )}

        {list}

        <ErrorMessages />
      </Box>
    );
  }
}

class SubmissionUI extends MainUI {
  constructor() {
    super();
    this.flavor = 'submission';
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

class SubmissionRunUI extends MainUI {
  constructor() {
    super();
    this.flavor = 'submission_run';
  }
}

export {SubmissionRunUI, SubmissionUI, TaskUI, RunUI};
