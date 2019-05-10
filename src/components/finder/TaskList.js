import React from "react"
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

import * as taskActions from "../../actions/tasks"

import BaseComponent from "../../base_component"
import TaskListing from "./TaskListing"
import * as fmt from "./formatters"
import "./TaskList.css"

class TaskList extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        { title: "Task ID", name: "idButton" },
        { title: "Path", name: "path" },
        { title: "PR #", name: "pull_request_number" },
        { title: "Status", name: "status" },
        { title: "Created", name: "created_at" },
      ],
      pageSizes: [1, 5, 10, 20, 40],
    }
  }
  createTasks = () => {
    return this.props.tasks.map(task => (
      <TaskListing key={task.id} task={task} />
    ))
  }

  changeCurrentPage = currentPage => {
    this.props.taskActions.fetchTasks(
      this.props.repository,
      this.props.refName,
      this.props.sha,
      currentPage,
      this.props.pageSize,
    )
  }

  changePageSize = pageSize => {
    this.props.taskActions.fetchTasks(
      this.props.repository,
      "",
      this.props.currentPage,
      pageSize,
    )
  }

  render() {
    const { columns, pageSizes } = this.state
    const { tasks, totalCount, pageSize, currentPage, taskID } = this.props
    let rows = taskID ? tasks.filter(t => t.id + "" === taskID) : tasks
    return (
      <Grid columns={columns} rows={rows}>
        <DataTypeProvider
          formatterComponent={fmt.TaskIdFormatter}
          for={["idButton"]}
        />
        <DataTypeProvider
          formatterComponent={fmt.PrNumberFormatter}
          for={["pull_request_number"]}
        />
        <DataTypeProvider
          formatterComponent={fmt.CreatedAtFormatter}
          for={["created_at"]}
        />
        <DataTypeProvider
          formatterComponent={fmt.PathFormatter}
          for={["path"]}
        />
        <DataTypeProvider
          formatterComponent={fmt.StatusFormatter}
          for={["status"]}
        />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={this.changeCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={this.changePageSize}
        />
        {taskID ? "" : <CustomPaging totalCount={totalCount} />}
        <Table />
        <TableHeaderRow />
        {taskID ? "" : <PagingPanel pageSizes={pageSizes} />}
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  const tasks = state.tasks.list.map(t => {
    return { ...t, status: t, idButton: t }
  })
  return {
    tasks,
    repository: state.tasks.filters.repository,
    refName: state.tasks.filters.refName,
    sha: state.tasks.filters.sha,
    totalCount: state.tasks.count,
    currentPage: state.tasks.filters.currentPage,
    pageSize: state.tasks.filters.pageSize,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    taskActions: bindActionCreators(taskActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskList)
