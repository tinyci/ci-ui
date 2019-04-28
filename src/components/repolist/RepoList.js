import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Tooltip from "@material-ui/core/Tooltip"
import Input from "@material-ui/core/Input"
import IconButton from "@material-ui/core/IconButton"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import SearchIcon from "@material-ui/icons/Search"
import ViewListIcon from "@material-ui/icons/ViewList"
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty"
import CloseIcon from "@material-ui/icons/Close"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import BaseComponent from "../../base_component"

import RepositoryControl from "./RepositoryControl"
import * as repositoryActions from "../../actions/repositories"

import "./RepoList.css"

class RepoList extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = { showOnlyAddedSubscribed: false }
  }

  toggleShowOnlyAddedSubscribed = () => {
    this.setState({
      showOnlyAddedSubscribed: !this.state.showOnlyAddedSubscribed,
    })
  }

  handleSearchChange = event => {
    const self = this
    const search = event.target.value
    window.clearTimeout(this.state.delayTimer)
    this.setState({
      search,
      delayTimer: window.setTimeout(function() {
        self.props.repositoryActions.fetchRepositories(search)
      }, 400),
    })
  }

  logout = () => {
    window.location.href = "/uisvc/logout"
  }

  createRepositoryControls = () => {
    let otherVisibleRepos = this.props.otherVisibleRepositories

    if (this.state.showOnlyAddedSubscribed) {
      otherVisibleRepos = otherVisibleRepos.filter(r => {
        return !r.disabled
      })
    }
    this.props.subscribedRepositories.forEach(r => {
      r.subscribed = true
    })

    let repos = this.props.subscribedRepositories.concat(otherVisibleRepos)

    repos.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    return repos.map(repo => {
      return (
        <RepositoryControl
          key={repo.id}
          repository={repo}
          subscribed={repo.subscribed}
          added={!repo.disabled}
          onRepositoryChanged={() => {
            // This is a bit overkill... ideally we'd just refresh the
            // one repo, but this works for now.
            this.props.repositoryActions.fetchRepositories(this.state.search)
          }}
        />
      )
    })
  }

  componentWillMount = () => {
    this.props.repositoryActions.fetchRepositories()
  }

  render() {
    return (
      <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="sidebar-close" onClick={this.props.onClose}>
            <CloseIcon />
          </div>
          <span className="sidebar-logo-container">
            <img
              src="/logo-reverse-title.png"
              alt="TinyCI Logo"
              className="sidebar-logo"
            />
          </span>
          <div className="sidebar-search">
            <Input
              placeholder="Search Repositories"
              onChange={this.handleSearchChange}
            />
            <div className="search-icon">
              {this.props.loading ? (
                <Tooltip title="Scanning repositories you own">
                  <HourglassEmptyIcon />
                </Tooltip>
              ) : (
                <SearchIcon />
              )}
            </div>
          </div>
        </div>
        <div className="sidebar-repositories">
          {this.createRepositoryControls()}
        </div>
        <div className="sidebar-footer">
          <div
            className={
              "sidebar-added-subscribed-list " +
              this.showIf(
                this.state.showOnlyAddedSubscribed,
                "sidebar-show-added-subscribed-only",
              )
            }
            onClick={this.toggleShowOnlyAddedSubscribed}
          >
            <span className="sidebar-added-subscribed-icon">
              <ViewListIcon />
            </span>{" "}
            ADDED | SUBSCRIBED LIST
          </div>
          <div className="sidebar-user-control">
            <div className="sidebar-username">
              {this.props.username}
              <Tooltip
                title="Upgrade user account & give additional privileges to tinyCI"
                aria-label="Upgrade user account & give additional privileges to tinyCI"
              >
                <IconButton
                  style={{ color: "white" }}
                  href="/uisvc/login/upgrade"
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="sidebar-logout" onClick={this.logout}>
              <ExitToAppIcon className="sidebar-logout-icon" />
              log out
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const removeSubscribedFromList = (subscribed, list) => {
  const nameMap = subscribed.reduce((acc, current) => {
    acc[current.name] = current
    return acc
  }, {})
  return list.filter(repo => !nameMap[repo.name])
}
export { removeSubscribedFromList }

const mapStateToProps = state => {
  return {
    subscribedRepositories: state.repositories.subscribedList,
    otherVisibleRepositories: removeSubscribedFromList(
      state.repositories.subscribedList,
      state.repositories.visibleList,
    ),
    username: state.users.username,
    loading: state.ui.activeRepositoriesRequests > 0,
  }
}

const mapActionsToProps = dispatch => {
  return {
    repositoryActions: bindActionCreators(repositoryActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(RepoList)
