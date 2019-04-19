import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Button from "@material-ui/core/Button"
import blue from "@material-ui/core/colors/blue"
import grey from "@material-ui/core/colors/grey"
import renderStatus from "../../render_status.js"
import * as runActions from "../../actions/runs"

const styles = {
  repoButton: {
    backgroundColor: "white",
    color: blue[900],
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textTransform: "none",
  },
  logButton: {
    backgroundColor: grey[300],
    color: "black",
  },
}

class RunFilterButton extends Component {
  render() {
    return (
      <React.Fragment>
        <Button
          style={styles.repoButton}
          onClick={() => {
            this.props.runActions.fetchRuns(
              0,
              this.props.pageSize,
              this.props.repository,
              this.props.sha,
            )
          }}
        >
          {this.props.children}
        </Button>
        {this.props.extra ? <span>{"(" + this.props.extra + ")"}</span> : ""}
      </React.Fragment>
    )
  }
}
RunFilterButton = connect(
  state => {
    return {
      pageSize: state.runs.filters.pageSize,
    }
  },
  dispatch => {
    return {
      runActions: bindActionCreators(runActions, dispatch),
    }
  },
)(RunFilterButton)

export const RepoFilterFormatter = ({ value }) => (
  <RunFilterButton repository={value.name}>{value.name}</RunFilterButton>
)

export const SHAFilterFormatter = ({ value }) => (
  <RunFilterButton
    repository={value.repository_name}
    sha={value.sha}
    extra={value.extra}
  >
    {value.name}
  </RunFilterButton>
)

export const StatusFormatter = ({ value }) => {
  return renderStatus(value)
}

export const LogLinkFormatter = ({ value }) => {
  if (value.started_at) {
    return (
      <Button style={styles.logButton} href={"/log/" + value.id}>
        {value.id}
      </Button>
    )
  } else {
    return (
      <Button disabled={true} color="inherit">
        {value.id}
      </Button>
    )
  }
}

export const PrNumberFormatter = ({ value }) => {
  if (value && value.pull_request_id) {
    return (
      <a
        href={
          "https://github.com/" +
          value.parent.name +
          "/pull/" +
          value.pull_request_id
        }
      >
        {value.pull_request_id}
      </a>
    )
  } else {
    return "push"
  }
}

export const TimesFormatter = ({ value }) => {
  if (!value.started_at) {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } else if (value.started_at && !value.finished_at) {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>
                <b>Started:</b>
              </td>
              <td>{value.started_at}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <div>
        <table>
          <tr>
            <td>
              <b>Started At:</b>
            </td>
            <td>{value.started_at}</td>
          </tr>
          <tr>
            <td>
              <b>Finished At:</b>
            </td>
            <td>{value.finished_at}</td>
          </tr>
          <tr>
            <td>
              <b>Duration:</b>
            </td>
            <td>{value.duration}</td>
          </tr>
        </table>
      </div>
    )
  }
}
