import React from 'react';

import Client from '../../lib/client/client';

//import TaskList from './components/task-list';
import SubmitForm from '../submit-form';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import PublishIcon from '@material-ui/icons/Publish';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

class MainUI extends React.Component {
  state = {
    subscribed: [],
    submitDrawerOpen: false,
    listDrawerOpen: false,
    repository: null,
  };
  client = new Client();

  componentWillMount() {
    if (this.props.owner && this.props.repository) {
      this.setState({
        repository: this.props.owner + '/' + this.props.repository,
      });
    }
  }

  handleSubmitSelect() {
    this.setState({submitDrawerOpen: !this.state.submitDrawerOpen});
  }

  handleListSelect(repo) {
    if (repo.all) {
      this.setState({repository: null, listDrawerOpen: false});
    } else {
      this.setState({repository: repo.name, listDrawerOpen: false});
    }
  }

  handleRepositorySelect(listDrawerOpen) {
    if (listDrawerOpen) {
      this.client.repositoriesSubscribedGet({}, (err, subscribed) => {
        subscribed = [{all: true, name: 'All Repositories'}].concat(subscribed);
        this.setState({
          subscribed: subscribed,
          listDrawerOpen: listDrawerOpen,
        });
      });
    } else {
      this.setState({listDrawerOpen: listDrawerOpen});
    }
  }

  render() {
    var repository = 'All Repositories';

    if (this.state.repository) {
      repository = this.state.repository;
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
                  {repository}
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
          <List style={{zIndex: 2, width: '35%'}}>
            {this.state.subscribed.map(elem => (
              <ListItem
                button
                onClick={this.handleListSelect.bind(this, elem)}
                key={elem.name}>
                <ListItemText>{elem.name}</ListItemText>
              </ListItem>
            ))}
          </List>
        ) : (
          ''
        )}
      </Box>
    );
  }
}

export default MainUI;
