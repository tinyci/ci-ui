import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import * as runActions from "../../actions/runs"
import * as uiActions from "../../actions/ui"

import timeAgo from "time-ago"
import moment from "moment"

import renderStatus from "../../render_status"

export const PathFormatter = ({ value }) => {
  return value + "/"
}

export const StatusFormatter = ({ value }) => {
  return renderStatus(value)
}

export const PrNumberFormatter = ({ value }) => {
  if (value && value.pull_request_id) {
    return (
      <a
        href={
          "https://github.com/" + value.name + "/pull/" + value.pull_request_id
        }
      >
        {value.pull_request_id}
      </a>
    )
  } else {
    return "push"
  }
}

export const CreatedAtFormatter = ({ value }) => {
  const date = Date.parse(value)
  const elapsed = Date.now() - date
  // 2 days
  if (elapsed > 86400000 * 2) {
    return moment(date).format("YYYY-MM-DD")
  }
  return timeAgo.ago(date)
}

const mapStateToProps = state => {
  return {
    repository: state.tasks.filters.repository,
    refName: state.tasks.filters.refName,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
    runActions: bindActionCreators(runActions, dispatch),
  }
}

class TaskIdButton extends Component {
  render() {
    return (
      <div
        onClick={() => {
          this.props.runActions.fetchTaskRuns(
            this.props.runCurrentPage,
            this.props.runPageSize,
            this.props.taskID,
            () => {
              this.props.uiActions.navigateTo(
                "/" +
                  this.props.repository +
                  "/" +
                  this.props.refName +
                  "/" +
                  this.props.sha +
                  "/" +
                  this.props.taskID,
              )
            },
          )
        }}
      >
        {this.props.taskID}
      </div>
    )
  }
}
TaskIdButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskIdButton)

export const TaskIdFormatter = ({ value }) => {
  console.log(value)

  return <TaskIdButton taskID={value.id} sha={value.ref.sha} />
}
