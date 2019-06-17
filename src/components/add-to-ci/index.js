import React from 'react';

import Client from '../../lib/client/client';

import {handleError} from '../error-messages';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import blueGrey from '@material-ui/core/colors/blueGrey';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PeopleIcon from '@material-ui/icons/People';
import SearchIcon from '@material-ui/icons/Search';

class AddToCI extends React.Component {
  state = {
    scanning: false,
    searching: false,
    adding: false,
    search: '',
    matchedRepositories: [],
  };

  client = new Client();
  searchTimer = null;

  startScan() {
    this.setState({scanning: true});
    this.client.repositoriesScanGet((err, res, resp) => {
      this.setState({scanning: false});
      handleError(err, resp);
    });
  }

  doSearch() {
    this.client.repositoriesMyGet(
      {search: this.state.search},
      (err, res, resp) => {
        this.setState({
          matchedRepositories: res.slice(0, 10),
          searching: false,
        });
      },
    );
  }

  removeFromCI(repository) {
    var [owner, repo] = repository.split('/', 2);
    this.setState({adding: true});
    this.client.repositoriesCiDelOwnerRepoGet(owner, repo, (err, res, resp) => {
      handleError(err, resp);
      this.setState({adding: false});
      this.handleSearch(this.state.search);
    });
  }

  addToCI(repository) {
    var [owner, repo] = repository.split('/', 2);
    this.setState({adding: true});
    this.client.repositoriesCiAddOwnerRepoGet(owner, repo, (err, res, resp) => {
      handleError(err, resp);
      this.setState({adding: false});
      this.handleSearch(this.state.search);
    });
  }

  handleSearch(chg) {
    this.setState({searching: true, search: chg});
    if (this.searchTimer) {
      window.clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchTimer = window.setTimeout(this.doSearch.bind(this), 500);
  }

  render() {
    return (
      <React.Fragment>
        <List
          style={{
            backgroundColor: blueGrey.A400,
            zIndex: 2,
            position: 'absolute',
            minWidth: '35%',
            maxWidth: '50%',
          }}>
          <ListItem key="tinyci-scanupgradeitem">
            <Box>
              <Typography>Actions:</Typography>
              <Box>
                <Tooltip title="Scan remote repositories">
                  <Button
                    onClick={this.startScan.bind(this)}
                    variant="outlined">
                    {this.state.scanning ? (
                      <MoreHorizIcon />
                    ) : (
                      <CloudUploadIcon />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip title="Upgrade your oauth account to allow repository adding">
                  <Button href="/uisvc/login/upgrade" variant="outlined">
                    <PeopleIcon />
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </ListItem>
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
              <Typography>{elem.name}</Typography>
              {this.state.adding ? (
                <MoreHorizIcon />
              ) : elem.disabled ? (
                <IconButton onClick={this.addToCI.bind(this, elem.name)}>
                  <AddIcon />
                </IconButton>
              ) : (
                <IconButton onClick={this.removeFromCI.bind(this, elem.name)}>
                  <RemoveIcon />
                </IconButton>
              )}
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
        </List>
        <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          open={this.state.scanning}
          message="Scanning repositories from the remote resource. This can take some time, please be patient."
        />
      </React.Fragment>
    );
  }
}

export default AddToCI;
