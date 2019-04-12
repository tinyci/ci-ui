import React from "react"

import * as runActions from "./actions/runs"
import { connect } from "react-redux"
import BaseComponent from "./base_component.js"
import { withStyles } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Icon from "@material-ui/core/Icon"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import CircularProgress from "@material-ui/core/CircularProgress"
import Switch from "@material-ui/core/Switch"
import Typography from "@material-ui/core/Typography"
import { successToast, errorToast } from "./toasts.js"

const switchStyles = theme => ({
  colorSwitchBase: {
    color: "#ddd",
    "&$colorChecked": {
      color: "#888",
      "& + $colorBar": {
        backgroundColor: "#aaa",
      },
    },
  },
  colorBar: {},
  colorChecked: {},
})

class RepoList extends BaseComponent {
  state = {
    drawerOpen: false,
    listHeight: 0,
    tabIndex: 2,
    repositories: [],
    all: false,
    checked: {},
    modifying: null,
    watching: "subscribed",
  }

  getChecked(result) {
    var checked = {}
    result.forEach(elem => {
      checked[elem.name] = true
    })
    return checked
  }

  componentDidMount() {
    this.setState({ listHeight: this.getHeight([0, "repotabs"]) })
    this.getSubscribedRepos()
  }

  getSubscribedRepos() {
    this.getAndUpdateState(
      this.apiUrl("/uisvc/repositories/subscribed"),
      { all: false, transfer: true, watching: "subscribed", tabIndex: 2 },
      result => {
        this.setState({
          checked: this.getChecked(result),
          repositories: result,
          all: false,
          transfer: false,
        })
      },
      error => {
        errorToast("error contacting the ui server: " + error)
        this.setState({ transfer: false })
      },
    )
  }

  getSwitchName(full_name) {
    full_name.replace("/", "_").replace("-", "_")
  }

  getVisibleRepos() {
    this.getAndUpdateState(
      this.apiUrl("/uisvc/repositories/visible"),
      { transfer: true, all: false, watching: "visible", tabIndex: 1 },
      result => {
        if (result === null) {
          result = []
        }
        this.setState({ repositories: result, all: false, transfer: false })
      },
      error => {
        this.setState({ transfer: false })
        errorToast("error contacting the ui server: " + error)
      },
    )
  }

  getMyRepos() {
    this.getAndUpdateState(
      this.apiUrl("/uisvc/repositories/my"),
      { transfer: true, all: true, watching: "my", tabIndex: 0 },
      result => {
        if (result === null) {
          result = []
        }
        this.setState({ repositories: result, all: true, transfer: false })
        successToast("Retrieved repositories from Github!")
      },
      error => {
        this.setState({ transfer: false })
        errorToast("error contacting the ui server: " + error)
      },
    )
  }

  toggleRepo(repoName, type) {
    if (this.state.checked[repoName]) {
      this.getAndUpdateState(
        this.apiUrl("/uisvc/repositories/" + type + "/del/" + repoName),
        { modifying: repoName },
        result => {
          var repo = { [repoName]: false }
          var obj = Object.assign(this.state.checked, repo)
          this.setState({
            modifying: null,
            repositories: this.state.repositories.filter(
              item => this.state.checked[item.github.full_name],
            ),
            checked: obj,
          })
          successToast("successfully unsubscribed!")
        },
        error => {
          this.setState({ modifying: null })
          errorToast("error unsubscribing: " + error)
        },
      )
    } else {
      this.getAndUpdateState(
        this.apiUrl("/uisvc/repositories/" + type + "/add/" + repoName),
        { modifying: repoName },
        result => {
          var repo = { [repoName]: true }
          this.setState({
            modifying: null,
            checked: Object.assign(this.state.checked, repo),
          })
          successToast("successfully subscribed!")
        },
        error => {
          this.setState({ modifying: null })
          errorToast("error subscribing: " + error)
        },
      )
    }
  }

  toggleRepoCI(self, repoName) {
    self.toggleRepo(repoName, "ci")
  }

  toggleRepoSub(self, repoName) {
    self.toggleRepo(repoName, "sub")
  }

  render() {
    var classes = this.props.classes
    var open = this.props.open

    var switchClasses = {
      switchBase: classes.colorSwitchBase,
      checked: classes.colorChecked,
      bar: classes.colorBar,
    }

    var header = (
      <Tabs
        id="repotabs"
        value={this.state.tabIndex}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="primary"
      >
        <Tab
          label={
            <div>
              <Icon>edit</Icon>
              <Typography>Add</Typography>
            </div>
          }
          onClick={() => {
            this.getMyRepos()
          }}
        />
        <Tab
          label={
            <div>
              <Icon>add</Icon>
              <Typography>Subscribe</Typography>
            </div>
          }
          onClick={() => {
            this.getVisibleRepos()
          }}
        />
        <Tab
          label={
            <div>
              <Icon>visibility</Icon>
              <Typography>Watched</Typography>
            </div>
          }
          onClick={() => {
            this.getSubscribedRepos()
          }}
        />
      </Tabs>
    )

    var content
    content = (
      <div>
        <Divider />
        <List
          style={{
            margin: 0,
            padding: 0,
            height: this.state.listHeight,
            overflow: "auto",
          }}
        >
          {this.state.transfer && (
            <center style={{ marginTop: 20 }}>
              <Typography variant="title">
                Loading repositories... Please wait!
              </Typography>
              <CircularProgress
                size={this.getHeight() / 3}
                style={{
                  marginTop: this.getHeight() / 6,
                  height: this.getHeight() / 3,
                }}
              />
            </center>
          )}
          {!this.state.transfer &&
            this.state.repositories.map(item => {
              var trailer

              item = item.github
              if (this.state.modifying === item.full_name) {
                trailer = (
                  <CircularProgress style={{ marginRight: 20 }} size={25} />
                )
              } else {
                var subFunc = this.toggleRepoCI
                if (
                  this.state.watching === "visible" ||
                  this.state.watching === "subscribed"
                ) {
                  subFunc = this.toggleRepoSub
                }

                trailer = (
                  <Switch
                    checked={this.state.checked[item.full_name]}
                    onClick={() => {
                      subFunc(this, item.full_name)
                    }}
                    classes={switchClasses}
                  />
                )
              }

              return (
                <ListItem style={this.noMargin} button key={item.full_name}>
                  <img
                    style={{ height: 80, width: 80 }}
                    alt={item.owner.login}
                    src={item.owner.avatar_url}
                  />
                  <ListItemText
                    onClick={() => {
                      this.props.dispatch(
                        runActions.setRunRepositoryFilter(item.full_name),
                      )
                    }}
                  >
                    {item.full_name}
                  </ListItemText>
                  {trailer}
                </ListItem>
              )
            })}
        </List>
      </div>
    )

    return (
      <Drawer variant="persistent" anchor="left" open={open} id="repolist">
        {header}
        {content}
      </Drawer>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

// TODO: figure out why I can't use mapActionsToProps on this component. It errors. Using this.props.dispatch for now.
// function mapActionsToProps(dispatch) {
//   return {
//     runActions: bindActionCreators(runActions, dispatch),
//   }
// }

export default connect(mapStateToProps)(withStyles(switchStyles)(RepoList))
