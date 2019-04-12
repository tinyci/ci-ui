import React from "react"
import Base from "./base.js"
import BaseComponent from "./base_component.js"
import RunTable from "./components/runtable/RunTable"

class Main extends BaseComponent {
  elements = [0, "repoName"]

  render() {
    return (
      <Base listState={this} repoName={{ state: {} }}>
        <div
          style={{
            overflowX: "scroll",
            //            visibility: loading ? "hidden" : "visible", TODO
          }}
        >
          <RunTable />
        </div>
        {false ? ( // todo
          <div>
            <center>
              <img src="tiny-loading.gif" alt="" />
            </center>
          </div>
        ) : (
          ""
        )}
      </Base>
    )
  }
}

export default Main
