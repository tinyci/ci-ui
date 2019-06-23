import React from 'react';

import Client from '../../lib/client/client';
import muiTheme from '../../muitheme.js';

import {handleError} from '../error-messages';
import RepoSearch from '../repo-search';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PeopleIcon from '@material-ui/icons/People';

class AddToCI extends React.Component {
  state = {
    scanning: false,
  };

  client = new Client();

  startScan() {
    this.setState({scanning: true});
    this.client.repositoriesScanGet((err, res, resp) => {
      this.setState({scanning: false});
      handleError(err, resp);
    });
  }

  removeFromCI(repository, promise) {
    var [owner, repo] = repository.split('/', 2);
    this.client.repositoriesCiDelOwnerRepoGet(owner, repo, (err, res, resp) => {
      handleError(err, resp);
      promise();
    });
  }

  addToCI(repository, promise) {
    var [owner, repo] = repository.split('/', 2);
    this.client.repositoriesCiAddOwnerRepoGet(owner, repo, (err, res, resp) => {
      handleError(err, resp);
      promise();
    });
  }

  repositoryList(search, promise) {
    this.client.repositoriesMyGet({search: search}, (err, res, resp) => {
      handleError(err, resp);
      promise(res);
    });
  }

  render() {
    return (
      <React.Fragment>
        <List
          style={{
            backgroundColor: muiTheme.palette.primary.main,
            zIndex: 2,
            position: 'absolute',
            minWidth: '35%',
            maxWidth: '50%',
            boxShadow: '0 10px 10px rgba(0, 0, 0, 0.5)',
          }}>
          <ListItem key="tinyci-scanupgradeitem">
            <Box>
              <Typography color="secondary">Actions:</Typography>
              <Box>
                <Tooltip title="Scan remote repositories">
                  <Button
                    color="secondary"
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
                  <Button
                    color="secondary"
                    href="/uisvc/login/upgrade"
                    variant="outlined">
                    <PeopleIcon />
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </ListItem>
          <RepoSearch
            list={(search, promise) => {
              this.repositoryList(search, promise);
            }}
            enabled={elem => !elem.disabled}
            onAdd={(elem, promise) => {
              this.addToCI(elem.name, promise);
            }}
            onRemove={(elem, promise) => {
              this.removeFromCI(elem.name, promise);
            }}>
            <Box container="span">
              <Typography style={{color: muiTheme.palette.primary.light}}>
                Scan for items from remote resources by clicking the cloud icon
                above, then search and add the repositories you wish to use in
                tinyCI.
              </Typography>
              <br />
              <Typography style={{color: muiTheme.palette.primary.light}}>
                Please note you will also need an "upgraded" set of OAuth scopes
                to process/admin CI jobs which will be granted if you click the
                "people" icon above. You will be redirected to your OAuth
                source.
              </Typography>
            </Box>
          </RepoSearch>
        </List>
        <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          open={this.state.scanning}
          message="Scanning repositories from the remote resource. This can take some
          time, please be patient. Note you will need to have an upgraded token
          (the people icon above) to add things to CI."
        />
      </React.Fragment>
    );
  }
}

export default AddToCI;
