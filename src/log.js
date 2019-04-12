import React from "react"
import Base from "./base.js"
import BaseComponent from "./base_component.js"
import LogStats from "./logstats.js"
import { errorToast } from "./toasts.js"
import { Terminal } from "xterm"
import { fit } from "xterm/lib/addons/fit/fit"
import "xterm/lib/xterm.css"

class Log extends BaseComponent {
  state = { panelHeight: 0, run: null }
  xterm = null
  domTerm = null

  componentDidMount() {
    var i = Number(this.props.match.params.id)

    this.getAndUpdateState(
      this.apiUrl("/uisvc/run/" + i),
      { run: null },
      result => {
        this.setState({ run: result })
      },
      error => {
        error.then(res => res.errors[0]).then(res => errorToast(res))
      },
    )

    this.domTerm = document.getElementById("terminal")

    if (this.xterm === null) {
      this.xterm = new Terminal({ fontSize: 16 })

      this.xterm.open(this.domTerm)
      this.xterm.setOption("convertEol", true)

      var ws = new WebSocket(this.wsUrl("/uisvc/log/attach/" + i))

      ws.onmessage = event => {
        var parsed = JSON.parse(event.data)
        if (parsed.type === "error") {
          errorToast(parsed.payload)
          ws.close()
        }
        this.xterm.write(parsed.payload)
      }

      window.addEventListener("resize", this.resize.bind(this))
    }

    // ok. this exists because the size calculations below won't work until the
    // DOM is fully rendered.
    //
    // this sucks and I hate myself for it.
    window.setTimeout(this.resize.bind(this), 1)
  }

  resize() {
    this.domTerm.style.position = "absolute"
    this.domTerm.style.top =
      window.innerHeight - this.getHeight([0, "repoName", "topTable"]) + "px"
    this.domTerm.style.height =
      this.getHeight([0, "repoName", "topTable"]) + "px"
    fit(this.xterm)
  }

  render() {
    return (
      <Base
        repoName={this.state.run && this.state.run.task.ref.repository.name}
      >
        <LogStats run={this.state.run} />
        <div
          id="terminal"
          style={{
            width: "100%",
            right: 0,
            margin: 0,
            padding: 0,
            background: "black",
            color: "#ccc",
          }}
        />
      </Base>
    )
  }
}

export default Log
