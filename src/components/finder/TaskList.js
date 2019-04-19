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

import BaseComponent from "../../base_component"
import TaskListing from "./TaskListing"
import { PrNumberFormatter, TimesFormatter } from "./formatters"
import "./TaskList.css"

class TaskList extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        { title: "Task ID", name: "id" },
        { title: "Path", name: "path" },
        { title: "PR #", name: "pull_request_number" },
        { title: "Status", name: "status" },
        { title: "Times", name: "times" },
      ],
      totalCount: 0,
      pageSize: 20,
      pageSizes: [1, 5, 10, 20, 40],
      currentPage: 0,
    }
  }
  createTasks = () => {
    return this.props.tasks.map(task => (
      <TaskListing key={task.id} task={task} />
    ))
  }
  render() {
    const { columns } = this.state
    console.log("tasks", this.props.tasks)
    return (
      <Grid columns={columns} rows={this.props.tasks}>
        <DataTypeProvider
          formatterComponent={PrNumberFormatter}
          for={["pull_request_number"]}
        />
        <DataTypeProvider formatterComponent={TimesFormatter} for={["times"]} />
        <Table />
        <TableHeaderRow />
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks.list,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskList)
