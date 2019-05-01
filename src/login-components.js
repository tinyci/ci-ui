import React from 'react'

class LoginGateway extends React.Component {
  render () {
    return (
      <div className='login-body'>
        <div className='container'>
          <img className='login-image' src='login-icon.png' alt='logo' />
          <div className='login-title'>Login to Github</div>
          <p>
            We need you to login to Github to continue. This is needed to
            validate your login username. This is a minimal access attempt; if
            you need more access to control CI behavior, please use the upgrade
            button in the menu.
          </p>
          <div className='login-area'>
            <button>
              <a href={this.props.loginURL}>CONTINUE</a>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginGateway
