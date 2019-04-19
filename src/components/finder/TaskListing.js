import React from "react"

import BaseComponent from "../../base_component"
import renderStatus from "../../render_status"

class TaskListing extends BaseComponent {
  render() {
    const {
      id,
      pull_request_id,
      ref,
      settings,
      canceled,
      base_sha,
      created_at,
      parent,
      path,
    } = this.props.task
    return (
      <tr className="task-listing">
        <td className="task-id">{id}</td>
        <td className="task-path">{path}</td>
        <td className="task-pr-no">{pull_request_id}</td>
        <td className="task-status">{canceled}</td>
        <td className="task-time" />
      </tr>
    )
  }
}
export default TaskListing
