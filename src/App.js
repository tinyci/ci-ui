import React from 'react';
import Client from './lib/client/client';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import {handleError} from './components/error-messages';
import Loading from './components/loading';
import LoginGateway from './components/login-gateway';
import {TaskUI, RunUI} from './components/main-ui';

import './App.css';

const muiTheme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: {
      light: grey[200],
      dark: grey[700],
      main: grey[400],
    },
  },
});

class App extends React.Component {
  state = {loggedIn: null};
  client = new Client();
  interval = null;

  checkLogin() {
    this.client.loggedinGet((err, loggedIn) => {
      if (!handleError(err)) {
        this.setState({loggedIn: loggedIn});
      }
    });
  }

  componentDidMount() {
    this.interval = window.setInterval(this.checkLogin.bind(this), 60000);
    this.checkLogin();
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    if (!this.state.loggedIn) {
      return <Loading />;
    } else if (this.state.loggedIn === 'true') {
      return (
        <MuiThemeProvider theme={muiTheme}>
          <Router>
            {
              //<Route exact path="/log/:id" component={RunLog} />
            }
            <Route path="/runs/:task_id" exact component={RunUI} />
            <Route
              path="/tasks/:owner/:repository/:sha"
              exact
              component={TaskUI}
            />
            <Route path="/tasks/:owner/:repository" exact component={TaskUI} />
            <Route path="/" exact component={TaskUI} />
          </Router>
        </MuiThemeProvider>
      );
    } else if (this.state.loggedIn !== 'true') {
      return <LoginGateway loginURL={this.state.loggedIn} />;
    }
  }
}

export default App;
