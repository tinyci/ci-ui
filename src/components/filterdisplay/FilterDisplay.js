import React from "react"
import { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import purple from "@material-ui/core/colors/purple"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"

import BaseComponent from "../../base_component"
import * as runActions from "../../actions/runs"

class FilterDisplayView extends Component {
  render() {
    return (
      <div
        style={{
          float: "right",
          visibility: this.props.repository ? "visible" : "hidden",
          paddingLeft: 20,
          backgroundColor: purple[800],
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <IconButton
          color="inherit"
          style={{
            float: "right",
            visibility: this.props.repository ? "visible" : "hidden",
          }}
          onClick={this.props.onClear}
        >
          <Icon>cancel</Icon>
        </IconButton>
        <Typography
          style={{
            float: "left",
            paddingTop: "0.25em",
          }}
          variant="h6"
          color="inherit"
        >
          <span className="filter-text">
            {isFiltering(this.props.repository, this.props.sha)
              ? "Filtering: "
              : ""}
            {this.props.repository}{" "}
            {this.props.sha
              ? "(sha: " + this.props.sha.substr(0, 12) + ")"
              : ""}
          </span>
        </Typography>
      </div>
    )
  }
}
export { FilterDisplayView }

class FilterDisplay extends BaseComponent {
  render() {
    return (
      <FilterDisplayView
        repository={this.props.repository}
        sha={this.props.sha}
        onClear={() => {
          this.props.runActions.fetchRuns(
            this.props.currentPage,
            this.props.pageSize,
            "",
            "",
          )
        }}
      />
    )
  }
}

const isFiltering = (sha, repository) => {
  return !!(sha || repository)
}
export { isFiltering }

const mapStateToProps = state => {
  return {
    repository: state.runs.filters.repository,
    sha: state.runs.filters.sha,
    currentPage: state.runs.filters.currentPage,
    pageSize: state.runs.filters.pageSize,
  }
}

const mapActionsToProps = dispatch => {
  return {
    runActions: bindActionCreators(runActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(FilterDisplay)
