import React from 'react'

class LoginGateway extends React.Component {
  render () {
    return (
      <div className='container'>
        <div className='login-body'>
          <div className='bg-movement bg-movement-3' />
          <div className='bg-movement bg-movement-2' />
          <div className='bg-movement bg-movement-5' />
          <div className='bg-movement bg-movement-4' />
        </div>
        <img className='login-image' src='login-icon.png' alt='logo' />
        <div className='login-title'>Login to Github</div>
        <p>
          We need you to login to Github to continue. This is needed to validate
          your login username. This is a minimal access attempt; if you need
          more access to control CI behavior, please use the upgrade button in
          the menu.
        </p>
        <div className='login-area'>
          <button>
            <a href={this.props.loginURL}>CONTINUE</a>
          </button>
        </div>
      </div>
    )
  }
}

export default LoginGateway
