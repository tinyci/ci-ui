import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as userActions from "./actions/users"
import * as uiActions from "./actions/ui"
import BaseComponent from "./base_component.js"
import { Route } from "react-router-dom"
import { ConnectedRouter } from "connected-react-router"
import { history } from "./store/configureStore"
import Log from "./log.js"
import Main from "./main.js"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import green from "@material-ui/core/colors/green"
import purple from "@material-ui/core/colors/purple"
import LoginGateway from "./login-components.js"

import "./App.css"

const theme = createMuiTheme({
  typography: {
    fontSize: 16,
    useNextVariants: true,
  },
  palette: {
    primary: purple,
    secondary: green,
  },
})

class App extends BaseComponent {
  container = null
  state = {
    mounted: false,
    loggedIn: false,
    loginURL: "",
    errorTimer: null,
    backoffErrorTimer: null,
  }

  componentDidMount() {
    this.props.userActions.fetchUser()
    window
      .fetch(this.apiUrl("/uisvc/loggedin"))
      .then(res => res.json())
      .then(
        result => {
          if (result !== "true") {
            this.setState({ mounted: true, loggedIn: false, loginURL: result })
          } else {
            this.setState({ mounted: true, loggedIn: true })
          }
        },
        error => {
          this.props.uiActions.processError(error)
        },
      )
  }

  render() {
    var router = ""

    if (this.state.mounted) {
      router = (
        <MuiThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <React.Fragment>
              <Route
                path="/:orgName?/:repoName?/:refName?/:sha?/:taskID?/:runID?"
                component={Main}
              />
              <Route exact path="/log/:id" component={Log} />
            </React.Fragment>
          </ConnectedRouter>
        </MuiThemeProvider>
      )

      if (this.state.mounted && this.state.loggedIn === false) {
        router = <LoginGateway loginURL={this.state.loginURL} />
      }
    }
    return router
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
