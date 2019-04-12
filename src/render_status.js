import React from "react"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import purple from "@material-ui/core/colors/purple"
import green from "@material-ui/core/colors/green"
import yellow from "@material-ui/core/colors/yellow"
import orange from "@material-ui/core/colors/orange"
import red from "@material-ui/core/colors/red"

const renderStatus = run => {
  var cancelButton = (
    <IconButton
      style={{ marginLeft: 10 }}
      onClick={() => {
        var xhttp = new XMLHttpRequest()
        xhttp.open("POST", "/uisvc/cancel/" + run.id, true)
        xhttp.send("")
      }}
    >
      <Icon>cancel</Icon>
    </IconButton>
  )

  if (run.started_at && !run.finished_at) {
    return (
      <div>
        <Button
          disabled={true}
          style={{ fontSize: 12, color: "white", backgroundColor: yellow[800] }}
        >
          Running
        </Button>
        {cancelButton}
      </div>
    )
  } else if (run.task.canceled) {
    return (
      <Button
        disabled={true}
        style={{ fontSize: 12, color: "white", backgroundColor: orange[700] }}
      >
        Canceled
      </Button>
    )
  } else if (run.started_at && run.finished_at) {
    if (run.status) {
      return (
        <Button
          disabled={true}
          style={{ fontSize: 12, color: "white", backgroundColor: green[300] }}
        >
          Passed
        </Button>
      )
    } else {
      return (
        <Button
          disabled={true}
          style={{ fontSize: 12, color: "white", backgroundColor: red[300] }}
        >
          Failed
        </Button>
      )
    }
  }

  return (
    <div>
      <Button
        disabled={true}
        style={{ fontSize: 12, color: "white", backgroundColor: purple[100] }}
      >
        Queued
      </Button>
      {cancelButton}
    </div>
  )
}

export default renderStatus
