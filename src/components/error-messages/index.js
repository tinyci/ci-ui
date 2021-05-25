import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";

export const handlePlainError = (payload) => {
  if (ErrorMessages.__singleton) {
    var errors = ErrorMessages.__singleton.state.errors;
    if (!errors.find((elem) => elem.message === payload)) {
      errors.push({ message: payload });
    }

    ErrorMessages.__singleton.setState({ errors: errors });
  }
};

export const handleError = (err, resp) => {
  if (err) {
    if (process.env.NODE_ENV !== "production") {
      console.log(err);
    }

    if (ErrorMessages.__singleton) {
      var errors = ErrorMessages.__singleton.state.errors;
      if (err.message === "Internal Server Error") {
        var errObj = JSON.parse(resp.text);
        if (errObj && errObj.errors) {
          errObj.errors.forEach((e) => {
            if (!errors.find((elem) => elem.message === e)) {
              errors.push({ message: e });
            }
          });
        }
      } else if (!errors.find((elem) => elem.message === err.message)) {
        errors.push(err);
      }
      ErrorMessages.__singleton.setState({ errors: errors });
    }

    return true;
  }

  return false;
};

export class ErrorMessages extends React.Component {
  state = { errors: [] };

  constructor(props) {
    super(props);
    ErrorMessages.__singleton = this;
  }

  onCloseHandler(errIndex) {
    this.setState({ errors: [] });
  }

  render() {
    return (
      <Snackbar
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={this.state.errors.length > 0}
        onClose={this.onCloseHandler.bind(this)}
        message={
          <List>
            {this.state.errors.map((e) => (
              <ListItem key={e.message}>
                <ListItemText>Error: {e.message}</ListItemText>
              </ListItem>
            ))}
          </List>
        }
      />
    );
  }
}
