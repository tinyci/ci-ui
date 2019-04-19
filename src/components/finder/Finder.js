import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Grid from "@material-ui/core/Grid"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"

import * as uiActions from "../../actions/ui"
import * as taskActions from "../../actions/tasks"
import * as refActions from "../../actions/refs"

import BaseComponent from "../../base_component"
import Selector from "./Selector"
import TaskList from "./TaskList"

import "./Finder.css"

class Finder extends BaseComponent {
  componentDidMount = () => {
    this.fetch()
  }

  fetch = () => {
    console.log("is visible")
    if (this.refSelectorVisible()) {
      console.log("fetching!")
      this.fetchRefs()
    }
  }

  fetchTasks = () => {
    this.props.taskActions.fetchTasks(
      this.props.orgName,
      this.props.repoName,
      this.props.refName,
    )
  }

  fetchRefs = () => {
    this.props.refActions.fetchRefs(this.props.orgName, this.props.repoName)
  }

  navigate = path => {
    this.props.uiActions.navigateTo(path).then(() => {
      this.fetch()
    })
  }

  repoSelectorVisible = () => {
    return (
      this.props.orgName && this.props.orgs[this.props.orgName] !== undefined
    )
  }

  refSelectorVisible = () => {
    console.log(this.repoSelectorVisible() && !!this.props.repoName)
    return this.repoSelectorVisible() && !!this.props.repoName
  }

  render() {
    const columnSize = 2
    var fillColumnSize = 10

    if (this.repoSelectorVisible()) {
      fillColumnSize -= columnSize
    }
    if (this.refSelectorVisible()) {
      fillColumnSize -= columnSize
    }
    return (
      <Grid container spacing={0} className="finder">
        <Grid item xs={columnSize} className="finder-org-column finder-column">
          <div className="finder-column-header">
            Organizations{" "}
            <ChevronLeftIcon className="finder-column-header-arrow" />
          </div>
          {Object.keys(this.props.orgs)
            .sort()
            .map(o => (
              <Selector
                key={o}
                item={o}
                selected={this.props.orgName === o}
                onSelect={() => this.navigate("/" + o)}
                onDeselect={() => this.navigate("/")}
              />
            ))}
        </Grid>
        {this.repoSelectorVisible() ? (
          <Grid
            item
            xs={columnSize}
            className="finder-repo-column finder-column"
          >
            <div className="finder-column-header">
              Repositories{" "}
              <ChevronLeftIcon className="finder-column-header-arrow" />
            </div>
            {Object.keys(this.props.orgs[this.props.orgName])
              .sort()
              .map(r => (
                <Selector
                  key={r}
                  item={r}
                  selected={this.props.repoName === r}
                  onSelect={() =>
                    this.navigate("/" + this.props.orgName + "/" + r)
                  }
                  onDeselect={() => this.navigate("/" + this.props.orgName)}
                />
              ))}
          </Grid>
        ) : (
          ""
        )}
        {this.refSelectorVisible() ? (
          <Grid
            item
            xs={columnSize}
            className="finder-ref-column finder-column"
          >
            <div className="finder-column-header">
              Refs <ChevronLeftIcon className="finder-column-header-arrow" />
            </div>
            {this.props.refs.map(r => (
              <Selector
                key={r.id}
                item={slashify(r.ref_name)}
                selected={slashify(this.props.refName) === r.ref_name}
                onSelect={() =>
                  this.navigate(
                    "/" +
                      this.props.orgName +
                      "/" +
                      this.props.repoName +
                      "/" +
                      deslashify(r.ref_name),
                  )
                }
                onDeselect={() =>
                  this.navigate(
                    "/" + this.props.orgName + "/" + this.props.repoName,
                  )
                }
              />
            ))}
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={fillColumnSize}>
          <TaskList />
        </Grid>
      </Grid>
    )
  }
}

const deslashify = str => {
  return encodeURIComponent(str)
}

const slashify = str => {
  return decodeURIComponent(str)
}

const mapStateToProps = state => {
  const orgs = {}
  state.repositories.visibleList.forEach(r => {
    if (r.disabled) {
      return
    }
    const [org, repo] = r.name.split("/")
    if (!orgs[org]) {
      orgs[org] = {}
    }
    orgs[org][repo] = []
  })
  state.tasks.list.forEach(t => {
    const [org, repo] = t.parent.name.split("/")
    if (!orgs[org]) {
      return
    }
    orgs[org][repo].push(deslashify(t.ref.ref_name))
  })
  return {
    orgs,
    tasks: state.tasks.list,
    refs: state.refs.list,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
    taskActions: bindActionCreators(taskActions, dispatch),
    refActions: bindActionCreators(refActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Finder)
