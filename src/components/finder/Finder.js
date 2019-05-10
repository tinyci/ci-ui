import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Grid from "@material-ui/core/Grid"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"

import * as uiActions from "../../actions/ui"
import * as taskActions from "../../actions/tasks"
import * as runActions from "../../actions/runs"
import * as refActions from "../../actions/refs"

import BaseComponent from "../../base_component"
import Selector from "./Selector"
import TaskList from "./TaskList"
import RunTable from "../runtable/RunTable"
import TaskSelectorItem from "./TaskSelectorItem"
import { slashify, deslashify } from "./slashify"

import "./Finder.css"

class Finder extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = { lastOrgName: "", lastRepoName: "", firstLoad: true }
  }

  componentDidMount = () => {
    this.fetch()
  }

  fetch = () => {
    this.fetchTasks()
    this.fetchRefs()
    if (this.props.taskID) {
      this.fetchRuns()
    }
  }

  fetchTasks = callback => {
    this.props.taskActions.fetchTasks(
      this.props.orgName + "/" + this.props.repoName,
      this.props.refName,
      this.props.sha,
      this.props.taskFilters.currentPage,
      this.props.taskFilters.pageSize,
    )
  }

  fetchRuns = () => {
    this.props.runActions.fetchTaskRuns(
      this.props.runFilters.currentPage,
      this.props.runFilters.pageSize,
      this.props.taskID,
    )
  }

  fetchRefs = () => {
    this.props.refActions.fetchRefs(this.props.orgName, this.props.repoName)
  }

  navigate = path => {
    this.props.uiActions.navigateTo(path).then(() => {
      this.fetch()
      this.setScroll()
    })
  }

  repoSelectorVisible = () => {
    return (
      this.props.orgName && this.props.orgs[this.props.orgName] !== undefined
    )
  }

  refSelectorVisible = () => {
    return this.repoSelectorVisible() && !!this.props.repoName
  }

  shaSelectorVisible = () => {
    return this.refSelectorVisible() && !!this.props.refName
  }

  taskSelectorVisible = () => {
    return this.shaSelectorVisible() && !!this.props.sha
  }

  shouldLoadRefs = () => {
    return (
      this.props.orgName &&
      this.props.repoName &&
      (this.state.lastOrgName !== this.props.orgName ||
        this.state.lastRepoName !== this.props.repoName ||
        this.state.firstLoad)
    )
  }

  setScroll = () => {
    if (this.props.taskID) {
      const wrapper = document.getElementById("finder-container")
      wrapper.scrollLeft = 99999999
    }
  }

  getColumnCount = () => {
    var columnCount = 0
    if (this.repoSelectorVisible()) {
      columnCount++
    }
    if (this.refSelectorVisible()) {
      columnCount++
    }
    if (this.shaSelectorVisible()) {
      columnCount++
    }
    if (this.taskSelectorVisible()) {
      columnCount++
    }
    return columnCount
  }

  render() {
    const { refs, orgs, shas } = this.props
    if (this.shouldLoadRefs()) {
      this.fetchRefs()
      this.setState({
        lastOrgName: this.props.orgName,
        lastRepoName: this.props.repoName,
        firstLoad: false,
      })
    }

    const columnSize = 1
    var fillColumnSize = 11
    var columnMinWidth = 300
    var runViewMinWidth = 1200
    var columnCount = this.getColumnCount()
    console.log(columnCount)
    fillColumnSize -= columnCount * columnSize
    const wrapperMinWidth = columnMinWidth * columnCount + runViewMinWidth

    return (
      <div id="finder-container">
        <div id="finder-grid-wrapper" style={{ minWidth: wrapperMinWidth }}>
          <Grid container spacing={0} className="finder">
            <Grid
              item
              xs={columnSize}
              className="finder-org-column finder-column"
            >
              <div className="finder-column-header">
                Organizations{" "}
                <ChevronLeftIcon className="finder-column-header-arrow" />
              </div>
              {Object.keys(orgs)
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
                {Object.keys(orgs[this.props.orgName])
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
                className="finder-ref-column finder-column light-column"
              >
                <div className="finder-column-header">
                  Refs{" "}
                  <ChevronLeftIcon className="finder-column-header-arrow" />
                </div>
                {Object.keys(refs)
                  .sort()
                  .map(r => (
                    <Selector
                      key={r}
                      item={r}
                      selected={slashify(this.props.refName) === r}
                      onSelect={() =>
                        this.navigate(
                          "/" +
                            this.props.orgName +
                            "/" +
                            this.props.repoName +
                            "/" +
                            deslashify(r),
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
            {this.shaSelectorVisible() ? (
              <Grid
                item
                xs={columnSize}
                className="finder-ref-column finder-column light-column"
              >
                <div className="finder-column-header finder-task-header">
                  SHAs{" "}
                  <ChevronLeftIcon className="finder-column-header-arrow" />
                </div>
                {refs[slashify(this.props.refName)] &&
                  refs[slashify(this.props.refName)].map(r => (
                    <Selector
                      key={r.sha}
                      item={r.sha.slice(-8)}
                      tooltip={r.sha}
                      selected={slashify(this.props.sha) === r.sha}
                      onSelect={() =>
                        this.navigate(
                          "/" +
                            this.props.orgName +
                            "/" +
                            this.props.repoName +
                            "/" +
                            this.props.refName +
                            "/" +
                            r.sha,
                        )
                      }
                      onDeselect={() =>
                        this.navigate(
                          "/" +
                            this.props.orgName +
                            "/" +
                            this.props.repoName +
                            "/" +
                            this.props.refName,
                        )
                      }
                    />
                  ))}
              </Grid>
            ) : (
              ""
            )}
            {this.taskSelectorVisible() ? (
              <Grid
                item
                xs={columnSize}
                className="finder-task-column finder-column light-column"
              >
                <div className="finder-column-header">
                  Task{" "}
                  <ChevronLeftIcon className="finder-column-header-arrow" />
                </div>
                {this.props.tasks.map(t => (
                  <Selector
                    key={t.id}
                    item={<TaskSelectorItem task={t} />}
                    selected={t.id + "" === this.props.taskID}
                    onSelect={() =>
                      this.navigate(
                        "/" +
                          this.props.orgName +
                          "/" +
                          this.props.repoName +
                          "/" +
                          this.props.refName +
                          "/" +
                          this.props.sha +
                          "/" +
                          t.id,
                      )
                    }
                    onDeselect={() =>
                      this.navigate(
                        "/" +
                          this.props.orgName +
                          "/" +
                          this.props.repoName +
                          "/" +
                          this.props.refName +
                          "/" +
                          this.props.sha,
                      )
                    }
                  />
                ))}
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={fillColumnSize}>
              {this.props.taskID ? <TaskList taskID={this.props.taskID} /> : ""}
              {this.props.taskID ? <RunTable taskID={this.props.taskID} /> : ""}
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
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
  const refs = []
  state.refs.list.forEach(r => {
    if (!refs[r.ref_name]) {
      refs[r.ref_name] = []
    }
    refs[r.ref_name].push(r)
  })
  return {
    orgs,
    refs,
    tasks: state.tasks.list,
    taskFilters: state.tasks.filters,
    runFilters: state.runs.filters,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
    taskActions: bindActionCreators(taskActions, dispatch),
    runActions: bindActionCreators(runActions, dispatch),
    refActions: bindActionCreators(refActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Finder)
