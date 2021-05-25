import React from "react";
import "./login-gateway.css";

import { ErrorMessages } from "../error-messages";

class LoginGateway extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="login-body">
          <div className="bg-movement bg-movement-3" />
          <div className="bg-movement bg-movement-2" />
          <div className="bg-movement bg-movement-5" />
          <div className="bg-movement bg-movement-4" />
          <div className="bg-movement bg-movement-6" />
        </div>
        <img className="login-image" src="login-icon.png" alt="logo" />
        <div className="login-title">Login to Github</div>
        <p>
          We need you to login to Github to continue. This is needed to validate
          your login username. This is a minimal access attempt; if you need
          more access to control CI behavior, please use the upgrade button in
          the menu.
        </p>
        <div className="login-area">
          <a href={this.props.loginURL}>CONTINUE</a>
        </div>
        <ErrorMessages />
      </div>
    );
  }
}

export default LoginGateway;
