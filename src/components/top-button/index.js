import React from "react";

import muiTheme from "../../muitheme.js";

import Box from "@material-ui/core/Box";

export const topBorder = "1px solid " + muiTheme.palette.primary.light;

const topStyle = {
  width: "100%",
  height: "100%",
  borderRight: topBorder,
  paddingTop: "1em",
  paddingBottom: "1em",
  paddingLeft: "1em",
  marginRight: "1em",
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",
  userSelect: "none",
  OUserSelect: "none",
};

export const TopButton = (props) => (
  <React.Fragment>
    <div
      style={Object.assign(
        { cursor: props.onClick ? "pointer" : "inherit" },
        topStyle
      )}
      onClick={props.onClick}
    >
      {props.icon ? <span style={{ float: "left" }}>{props.icon}</span> : ""}
      <Box
        style={{
          float: props.icon ? "right" : "none",
          marginRight: props.nopad ? 0 : "1em",
          marginLeft: props.nopad ? 0 : "1em",
        }}
      >
        {props.flavor}
      </Box>
    </div>
  </React.Fragment>
);
