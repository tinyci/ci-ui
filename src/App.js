import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import * as userActions from "./actions/users"
import * as uiActions from "./actions/ui"

import BaseComponent from "./base_component.js"
import "./App.css"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Log from "./log.js"
import Main from "./main.js"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Typography from "@material-ui/core/Typography"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import green from "@material-ui/core/colors/green"
import purple from "@material-ui/core/colors/purple"

const theme = createMuiTheme({
  typography: {
    fontSize: 16,
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
          <Router>
            <div>
              <Route exact path="/" component={Main} />
              <Route exact path="/log/:id" component={Log} />
            </div>
          </Router>
        </MuiThemeProvider>
      )

      if (this.state.mounted && this.state.loggedIn === false) {
        var cardStyle = {
          position: "relative",
          left: (window.innerWidth / 4).toFixed(0) + "px",
          top: (window.innerHeight / 4).toFixed(0) + "px",
          width: window.innerWidth / 2,
        }

        router = (
          <Card style={cardStyle}>
            <CardContent>
              <Typography
                variant="title"
                style={{ textAlign: "center", marginBottom: "2em" }}
              >
                Login to Github
              </Typography>
              <Typography variant="h5" component="h2">
                We need you to login to github to continue. This only takes a
                moment and will redirect you to the github.com site to continue.
                We use your github credentials to:
                <ul>
                  <li>Validate your access</li>
                  <li>
                    Orchestrate repository pulls and tests for CI projects you
                    own
                  </li>
                </ul>
              </Typography>
            </CardContent>
            <CardActions>
              <Button href={this.state.loginURL}>Continue</Button>
            </CardActions>
          </Card>
        )
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
