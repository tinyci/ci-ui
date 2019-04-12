import React from "react"
import BaseComponent from "../base_component.js"
import queryString from "query-string"
import { successToast, errorToast } from "../toasts.js"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import Checkbox from "@material-ui/core/Checkbox"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import purple from "@material-ui/core/colors/purple"

class ManualSubmitForm extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      submitting: false,
    }
  }
  submitRepository = null
  submitRef = null
  testAll = false

  manualSubmit = () => {
    this.setState({ submitting: true })
    var qs = queryString.stringify({
      sha: this.submitRef,
      repository: this.submitRepository,
      all: this.testAll,
    })
    window
      .fetch("/uisvc/submit?" + qs, { credentials: "include" })
      .then(result => {
        this.setState({ submitting: false })
        successToast("Submitted!")
      })
      .catch(err => {
        this.setState({ submitting: false })
        errorToast("Submission error: " + err.json())
      })
  }

  render() {
    return (
      <div
        style={{
          top: 2,
          position: "absolute",
          left: "25%",
          right: "25%",
          width: "50%",
          height: "100%",
          textAlign: "center",
        }}
      >
        <InputLabel style={{ color: "white" }}>Submit&nbsp;&nbsp;</InputLabel>
        <Input
          disableUnderline
          style={{
            borderRadius: "4px",
            backgroundColor: purple[700],
            color: "white",
            padding: 3,
          }}
          placeholder="owner/repository"
          onChange={elem => {
            this.submitRepository = elem.target.value
          }}
        />
        <Input
          disableUnderline
          style={{
            borderRadius: "4px",
            backgroundColor: purple[700],
            color: "white",
            marginLeft: 10,
            marginRight: 10,
            padding: 3,
          }}
          placeholder="name or 40 char SHA"
          onChange={elem => {
            this.submitRef = elem.target.value
          }}
        />
        <Checkbox
          color="default"
          style={{ color: "white" }}
          onChange={(e, res) => {
            this.testAll = res
          }}
        />
        <IconButton
          disabled={this.state.submitting}
          style={{ color: "white" }}
          onClick={this.manualSubmit.bind(this)}
        >
          <Icon>{this.state.submitting ? "more_horiz" : "send"}</Icon>
        </IconButton>
      </div>
    )
  }
}

export default ManualSubmitForm
