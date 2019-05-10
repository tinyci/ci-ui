import React from "react"

import BaseComponent from "../../base_component"

import "./TaskSelectorItem.css"

class TaskSelectorItem extends BaseComponent {
  taskStatus = task => {
    if (task.canceled) return "canceled"
    if (task.finished_at) {
      if (task.status) {
        return "succeeded"
      }
      return "failed"
    }
    if (task.started_at) {
      return "pending"
    }
    return "active"
  }
  renderPath = path => {
    if (path.length > 10) {
      return "..." + path.slice(-10)
    }
    if (path === ".") {
      return "*root*"
    }
    return path
  }
  render() {
    const { id, path } = this.props.task
    return (
      <div className="task-selector-item">
        <span
          className={"status-circle info " + this.taskStatus(this.props.task)}
        />
        <div className="task-id info">{id}</div>
        <div className="task-path info" title={path.length > 10 ? path : ""}>
          {this.renderPath(path)}
        </div>
      </div>
    )
  }
}

export default TaskSelectorItem
