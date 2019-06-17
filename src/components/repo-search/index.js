import React from 'react';

import Client from '../../lib/client/client';

import {handleError} from '../error-messages';

import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import RemoveIcon from '@material-ui/icons/Remove';
import SearchIcon from '@material-ui/icons/Search';

class RepoSearch extends React.Component {
  state = {
    changing: false,
    search: '',
    matchedRepositories: [],
    searching: false,
  };

  client = new Client();
  searchTimer = null;

  handleSearch(chg) {
    this.setState({searching: true, search: chg});
    if (this.searchTimer) {
      window.clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchTimer = window.setTimeout(this.doSearch.bind(this), 500);
  }

  doSearch() {
    this.client.repositoriesMyGet(
      {search: this.state.search},
      (err, res, resp) => {
        if (!handleError(err, resp)) {
          this.setState({
            matchedRepositories: res.slice(0, 10),
            searching: false,
            changing: false,
          });
        }
      },
    );
  }

  performAction(action, elem) {
    this.setState({changing: true});
    action(elem, () => {
      this.doSearch();
      this.setState({changing: false});
    });
  }

  render() {
    return (
      <React.Fragment>
        <ListItem key="tinyci-searchitem">
          <TextField
            fullWidth
            label="Search for a Repository"
            placeholder="owner/repo"
            onChange={chg => {
              this.handleSearch(chg.target.value);
            }}
          />
          {this.state.searching ? <MoreHorizIcon /> : <SearchIcon />}
        </ListItem>
        {this.state.matchedRepositories.map(elem => (
          <ListItem key={elem.name}>
            {this.state.changing ? (
              <IconButton>
                <MoreHorizIcon />
              </IconButton>
            ) : elem.disabled ? (
              <IconButton
                onClick={this.performAction.bind(this, this.props.onAdd, elem)}>
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={this.performAction.bind(
                  this,
                  this.props.onRemove,
                  elem,
                )}>
                <RemoveIcon />
              </IconButton>
            )}
            <Typography>{elem.name}</Typography>
          </ListItem>
        ))}
        {this.state.matchedRepositories.length === 0 ? (
          <ListItem key="tinyci-scanhelpitem">
            <Typography>
              Scan for items from remote resources by clicking the cloud icon
              above, then search and add the repositories you wish to use in
              tinyCI.
            </Typography>
          </ListItem>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

export default RepoSearch;
