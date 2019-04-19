import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Base from "./base.js"
import BaseComponent from "./base_component.js"
import RunTable from "./components/runtable/RunTable"
import MessageDisplay from "./components/messagedisplay/MessageDisplay"
import Finder from "./components/finder/Finder"

class Main extends BaseComponent {
  elements = [0, "repoName"]

  render() {
    console.log("PARAMS", this.props.match.params)
    const { orgName, repoName, ref, taskID, runID } = this.props.match.params
    return (
      <Base listState={this} repoName={{ state: {} }}>
        <MessageDisplay />
        <div
          style={{
            overflowX: "scroll",
            height: "100%",
          }}
        >
          <Finder
            orgName={orgName}
            repoName={repoName}
            refName={ref} // for some reason 'ref' doesn't work, but 'refName' does
            taskID={taskID}
            runID={runID}
          />
        </div>
      </Base>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
