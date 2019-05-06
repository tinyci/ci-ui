import React from "react"
import BaseComponent from "./base_component.js"
import CopyItem from "./copyitem.js"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import Table from "@material-ui/core/Table"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableBody from "@material-ui/core/TableBody"
import Typography from "@material-ui/core/Typography"
import renderStatus from "./render_status.js"
import blue from "@material-ui/core/colors/blue"

class CenterHeader extends React.Component {
  render() {
    return (
      <TableCell>
        <Typography style={{ textAlign: "center" }} variant="subtitle2">
          {this.props.children}
        </Typography>
      </TableCell>
    )
  }
}

class LogStats extends BaseComponent {
  timer = null

  render() {
    const run = this.props.run
    if (run === null) {
      return <div id="topTable" />
    }

    var refURL =
      run.task.ref.repository.github.html_url + "/tree/" + run.task.ref.sha
    var refText = "Push Event"

    if (run.task.pull_request_id) {
      refURL =
        run.task.parent.github.html_url + "/pull/" + run.task.pull_request_id
      refText = run.task.pull_request_id
    }

    return (
      <div id="topTable">
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <CenterHeader>Pull Request</CenterHeader>
                <CenterHeader>Run ID</CenterHeader>
                <CenterHeader>Status</CenterHeader>
                <CenterHeader>Task ID</CenterHeader>
                <CenterHeader>Task</CenterHeader>
                <CenterHeader>SHA</CenterHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    style={{
                      fontSize: 12,
                      backgroundColor: blue[800],
                      color: "white",
                    }}
                    href={refURL}
                  >
                    {refText}
                  </Button>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <CopyItem
                    icon="link"
                    displayItem={run.id}
                    item={this.apiUrl("/log/" + run.id)}
                  />
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {renderStatus(run)}
                </TableCell>
                <TableCell>
                  <CopyItem item={run.task.id} />
                </TableCell>
                <TableCell>
                  <CopyItem item={run.name} />
                </TableCell>
                <TableCell>
                  <CopyItem
                    displayItem={run.task.ref.sha.substr(0, 8)}
                    item={run.task.ref.sha}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default LogStats
