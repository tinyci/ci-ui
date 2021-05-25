import React from "react";

import { topBorder } from "../top-button";

import Tooltip from "@material-ui/core/Tooltip";

class Home extends React.Component {
  render() {
    return (
      <Tooltip title="Home">
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRight: topBorder,
          }}
        >
          <a href={"/"}>
            <img
              alt="logo"
              style={{
                marginTop: "8px",
                marginLeft: "30px",
                marginRight: "auto",
                height: "32px",
              }}
              src="/logo-reverse-title.png"
            />
          </a>
        </div>
      </Tooltip>
    );
  }
}

export default Home;
