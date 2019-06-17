import React from 'react';

import Client from '../../lib/client/client';

import {handleError} from '../error-messages';
import RepoSearch from '../repo-search';

import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import blueGrey from '@material-ui/core/colors/blueGrey';

class SubscribedList extends React.Component {
  client = new Client();

  repositoryList(search, promise) {
    this.client.repositoriesVisibleGet({search: search}, (err, res, resp) => {
      handleError(err, resp);
      promise(res);
    });
  }

  filter(obj) {
    return !obj.disabled;
  }

  enabled(obj) {
    return this.props.mainui.state.subscribed
      .map(e => e.name)
      .includes(obj.name);
  }

  unsubscribe(repository, promise) {
    var [owner, repo] = repository.split('/', 2);
    this.client.repositoriesSubDelOwnerRepoGet(
      owner,
      repo,
      (err, res, resp) => {
        handleError(err, resp);
        promise();
      },
    );
  }

  subscribe(repository, promise) {
    var [owner, repo] = repository.split('/', 2);
    this.client.repositoriesSubAddOwnerRepoGet(
      owner,
      repo,
      (err, res, resp) => {
        handleError(err, resp);
        promise();
      },
    );
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: blueGrey[500],
          zIndex: 2,
          position: 'absolute',
          minWidth: '35%',
          maxWidth: '50%',
        }}>
        <List>
          <ListItem>
            <ListItemText>Subscribed Repositories</ListItemText>
          </ListItem>
          {this.props.mainui.state.subscribed.map(elem => (
            <ListItem button key={elem.name}>
              {elem.all ? (
                <Link
                  color="secondary"
                  style={{width: '100%', textDecoration: 'none'}}
                  href="/">
                  {elem.name}
                </Link>
              ) : (
                <Link
                  color="secondary"
                  style={{width: '100%', textDecoration: 'none'}}
                  href={'/tasks/' + elem.name}>
                  {elem.name}
                </Link>
              )}
            </ListItem>
          ))}
        </List>
        <RepoSearch
          list={(search, promise) => {
            this.repositoryList(search, promise);
          }}
          filter={elem => this.filter(elem)}
          enabled={elem => this.enabled(elem)}
          onAdd={(elem, promise) => {
            this.subscribe(elem.name, () => {
              this.props.mainui.handleRepositorySelect(true);
              promise();
            });
          }}
          onRemove={(elem, promise) => {
            this.unsubscribe(elem.name, () => {
              this.props.mainui.handleRepositorySelect(true);
              promise();
            });
          }}>
          <Typography color="secondary">
            Find a repository to watch for changes.
          </Typography>
        </RepoSearch>
      </div>
    );
  }
}

export default SubscribedList;
