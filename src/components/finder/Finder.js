import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Grid from "@material-ui/core/Grid"

import * as uiActions from "../.././actions/ui"
import * as taskActions from "../.././actions/tasks"

import BaseComponent from "../../base_component"
import Selector from "./Selector"

class Finder extends BaseComponent {
  render() {
    if (this.props.repoName) {
      //      this.props.taskActions.fetchTasks(this.props.orgName, this.props.repoName)
    }
    return (
      <Grid container spacing={0}>
        <Grid item xs={3}>
          {Object.keys(this.props.orgs)
            .sort()
            .map(o => (
              <Selector
                key={o}
                item={o}
                selected={this.props.orgName === o}
                onSelect={() => this.props.uiActions.navigateTo("/" + o)}
                onDeselect={() => this.props.uiActions.navigateTo("/")}
              />
            ))}
        </Grid>
        {this.props.orgName && this.props.orgs[this.props.orgName] ? (
          <Grid item xs={3}>
            {this.props.orgs[this.props.orgName].map(r => (
              <Selector
                key={r}
                item={r}
                selected={this.props.repoName === r}
                onSelect={() =>
                  this.props.uiActions.navigateTo(
                    "/" + this.props.orgName + "/" + r,
                  )
                }
                onDeselect={() =>
                  this.props.uiActions.navigateTo("/" + this.props.orgName)
                }
              />
            ))}
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs="auto">
          TASKS
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  const orgs = {}
  state.repositories.visibleList.forEach(r => {
    const [org, repo] = r.name.split("/")
    if (!orgs[org]) {
      orgs[org] = []
    }
    orgs[org].push(repo)
  })
  console.log("ORGS", orgs)
  console.log("visible", state.repositories)
  return {
    orgs,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
    taskActions: bindActionCreators(taskActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Finder)
