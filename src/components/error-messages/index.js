import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';

var errIndex = 0;

export const handleError = err => {
  errIndex++;
  if (err) {
    console.log(err);
    if (ErrorMessages.__singleton) {
      var errors = ErrorMessages.__singleton.state.errors;
      errors.push([errIndex, err]);
      ErrorMessages.__singleton.setState({errors: errors});
    }
    return true;
  }

  return false;
};

export class ErrorMessages extends React.Component {
  state = {errors: []};

  constructor(props) {
    super(props);
    ErrorMessages.__singleton = this;
  }

  onCloseHandler(errIndex) {
    this.setState({
      errors: this.state.errors.filter(elem => elem[0] === errIndex),
    });
  }

  render() {
    console.log(this.state.errors);
    return (
      <React.Fragment>
        {this.state.errors.map(elem => (
          <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            key={elem[0]}
            open={true}
            onClose={this.onCloseHandler.bind(this)}
            message={<span>Error: {elem[1].message}</span>}
          />
        ))}
      </React.Fragment>
    );
  }
}
