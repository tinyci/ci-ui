import React from "react";

import Client from "../../lib/client/client";
import muiTheme from "../../muitheme.js";

import { withStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

import AddIcon from "@material-ui/icons/Add";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import RemoveIcon from "@material-ui/icons/Remove";
import SearchIcon from "@material-ui/icons/Search";

const Field = withStyles({
  root: {
    "& label.MuiFormLabel-root": {
      color: muiTheme.palette.primary.light,
    },
    "& input.MuiInputBase-input": {
      color: muiTheme.palette.primary.contrastText,
    },
  },
})(TextField);

class RepoSearch extends React.Component {
  state = {
    changing: false,
    search: "",
    matchedRepositories: [],
    searching: false,
  };

  client = new Client();
  searchTimer = null;

  handleSearch(chg) {
    this.setState({ searching: true, search: chg });
    if (this.searchTimer) {
      window.clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchTimer = window.setTimeout(this.doSearch.bind(this), 500);
  }

  doSearch() {
    this.props.list(this.state.search, (res) => {
      if (res) {
        res = res
          .filter(this.props.filter ? this.props.filter : (obj) => true)
          .slice(0, 10);
      }
      this.setState({
        matchedRepositories: res || [],
        searching: false,
        changing: false,
      });
    });
  }

  performAction(action, elem) {
    this.setState({ changing: true });
    action(elem, () => {
      this.doSearch();
      this.setState({ changing: false });
    });
  }

  render() {
    return (
      <React.Fragment>
        <ListItem key="tinyci-searchitem">
          <Field
            fullWidth
            label="Search for a Repository"
            placeholder="owner/repo"
            onChange={(chg) => {
              this.handleSearch(chg.target.value);
            }}
          />
          {this.state.searching ? <MoreHorizIcon /> : <SearchIcon />}
        </ListItem>
        <ListItem key="tinyci-scanhelpitem">{this.props.children}</ListItem>
        {this.state.matchedRepositories.map((elem) => (
          <ListItem key={elem.name}>
            {this.state.changing ? (
              <IconButton color="primary">
                <MoreHorizIcon />
              </IconButton>
            ) : this.props.enabled(elem) ? (
              <Tooltip title="Remove this item">
                <IconButton
                  color="primary.contrastText"
                  onClick={this.performAction.bind(
                    this,
                    this.props.onRemove,
                    elem
                  )}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Box color="primary.light">
                <Tooltip title="Add this item">
                  <IconButton
                    onClick={this.performAction.bind(
                      this,
                      this.props.onAdd,
                      elem
                    )}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            <Box color="primary.light">{elem.name}</Box>
          </ListItem>
        ))}
      </React.Fragment>
    );
  }
}

export default RepoSearch;
