import React from 'react';
import Client from './lib/client/client';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import LoginGateway from './components/login-gateway';
import MainUI from './components/main-ui';

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

  componentWillMount() {
    this.client.loggedinGet((err, loggedIn) => {
      if (err !== null) {
        this.setState({error: err});
      } else {
        this.setState({loggedIn: loggedIn});
      }
    });
  }

  render() {
    if (this.state.loggedIn !== 'true') {
      return <LoginGateway loginURL={this.state.loggedIn} />;
    } else if (this.state.loggedIn !== null) {
      return (
        <MuiThemeProvider theme={muiTheme}>
          <Router>
            {
              //<Route exact path="/log/:id" component={RunLog} />
            }
            <Route path="/tasks/:owner/:repository" exact component={MainUI} />
            <Route path="/" exact component={MainUI} />
          </Router>
        </MuiThemeProvider>
      );
    } else {
      return <div />;
    }
  }
}

export default App;
