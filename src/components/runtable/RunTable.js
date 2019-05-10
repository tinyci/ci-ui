import PropTypes from "prop-types"
import React from "react"
import strftime from "strftime"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from "@devexpress/dx-react-grid-material-ui"
import {
  PagingState,
  DataTypeProvider,
  CustomPaging,
} from "@devexpress/dx-react-grid"

import * as runActions from "../../actions/runs"
import BaseComponent from "../../base_component"
import {
  RepoFilterFormatter,
  SHAFilterFormatter,
  StatusFormatter,
  LogLinkFormatter,
  PrNumberFormatter,
  TimesFormatter,
} from "./formatters"

class RunTable extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: "Run ID",
          name: "run",
        },
        {
          title: "Task ID",
          name: "taskId",
        },
        {
          title: "Repository",
          name: "repositoryData",
        },
        {
          title: "Branch",
          name: "branchData",
        },
        {
          title: "Task",
          name: "taskName",
        },
        {
          title: "PR #",
          name: "prNumber",
        },
        {
          title: "Status",
          name: "state",
        },
        {
          title: "Times",
          name: "times",
        },
      ],
      pageSizes: [1, 5, 10, 20, 40],
    }
  }

  componentDidMount = () => {}

  componentWillUnmount = () => {}

  // TODO: find a way to unify the fetch API... maybe with an object as parameter
  getRowData = () => {
    if (this.props.taskID) {
      this.props.runActions.fetchTaskRuns(
        this.props.currentPage,
        this.props.pageSize,
        this.props.taskID,
      )
    } else {
      this.props.runActions.fetchRuns(
        this.props.currentPage,
        this.props.pageSize,
        this.props.repository,
        this.props.sha,
      )
    }
  }

  changeCurrentPage = currentPage => {
    if (this.props.taskID) {
      this.props.runActions.fetchTaskRuns(
        currentPage,
        this.props.pageSize,
        this.props.taskID,
      )
    } else {
      this.props.runActions.fetchRuns(
        currentPage,
        this.props.pageSize,
        this.props.repository,
        this.props.sha,
      )
    }
  }

  changePageSize = pageSize => {
    if (this.props.taskID) {
      this.props.runActions.fetchTaskRuns(
        this.props.currentPage,
        pageSize,
        this.props.taskID,
      )
    } else {
      this.props.runActions.fetchRuns(
        this.props.currentPage,
        pageSize,
        this.props.repository,
        this.props.sha,
      )
    }
  }

  render() {
    const { columns, pageSizes } = this.state
    const { rows, totalCount, pageSize, currentPage, loading } = this.props
    if (loading) {
      return (
        <div>
          <center>
            <img src="tiny-loading.gif" alt="" />
          </center>
        </div>
      )
    }

    return (
      <Grid rows={rows} columns={columns}>
        <DataTypeProvider formatterComponent={LogLinkFormatter} for={["run"]} />

        <DataTypeProvider
          formatterComponent={StatusFormatter}
          for={["state"]}
        />

        <DataTypeProvider
          formatterComponent={RepoFilterFormatter}
          for={["repositoryData"]}
        />
        <DataTypeProvider
          formatterComponent={SHAFilterFormatter}
          for={["branchData"]}
        />
        <DataTypeProvider
          formatterComponent={PrNumberFormatter}
          for={["prNumber"]}
        />
        <DataTypeProvider formatterComponent={TimesFormatter} for={["times"]} />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={this.changeCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={this.changePageSize}
        />
        <CustomPaging totalCount={totalCount} />
        <Table />
        <TableHeaderRow />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
    )
  }
}

RunTable.propTypes = {
  rowActions: PropTypes.object,
  rows: PropTypes.array,
}

function createRows(runItems) {
  return runItems.map(run => ({
    run: run,
    taskId: run.task.id,
    taskName: run.name,
    prNumber: run.task,
    repositoryData: {
      name: run.task.ref.repository.name,
      sha: run.task.ref.sha,
      this: this,
    },
    branchData: {
      repository_name: run.task.ref.repository.name,
      sha: run.task.ref.sha,
      this: this,
      name: branchName(run.task.ref.ref_name),
      extra: run.task.ref.sha.substr(0, 12),
    },
    state: run,
    running: run.started_at && !run.finished_at,
    times: {
      started_at: dateFormat(run.started_at),
      finished_at: dateFormat(run.finished_at),
      duration: duration(run.started_at, run.finished_at),
    },
  }))
}

function branchName(ref_name) {
  var branch_parts = ref_name.split("/")
  return branch_parts[branch_parts.length - 1]
}
export { branchName }

function dateFormat(date) {
  if (!date) {
    return null
  }

  return strftime("%m/%d/%Y %H:%M", new Date(date))
}

function duration(date1, date2) {
  if (!date1 || !date2) {
    return null
  }

  var seconds = (new Date(date2).getTime() - new Date(date1).getTime()) / 1000

  if (seconds > 3600) {
    return (seconds / 3600).toFixed(2) + "h"
  } else if (seconds > 60) {
    return (seconds / 60).toFixed(2) + "m"
  } else {
    return seconds.toFixed(2) + "s"
  }
}
export { duration }

function mapStateToProps(state) {
  const props = {
    rows: createRows(state.runs.list),
    totalCount: state.runs.count,
    loading: state.runs.loading,
    currentPage: state.runs.filters.currentPage,
    pageSize: state.runs.filters.pageSize,
    repository: state.runs.filters.repository,
    sha: state.runs.filters.sha,
  }
  return props
}

function mapDispatchToProps(dispatch) {
  return {
    runActions: bindActionCreators(runActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RunTable)
