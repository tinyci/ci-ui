import React from "react"
import { connect } from "react-redux"
import BaseComponent from "./base_component.js"
import RepoList from "./repolist.js"
import CssBaseline from "@material-ui/core/CssBaseline"
import Button from "@material-ui/core/Button"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import { ToastContainer, ToastStore } from "react-toasts"
import purple from "@material-ui/core/colors/purple"

import ManualSubmitForm from "./components/ManualSubmitForm"
import FilterDisplay from "./components/filterdisplay/FilterDisplay"

class Base extends BaseComponent {
  state = { drawerOpen: false, repoListHeight: 0 }

  handleDrawerClose() {
    this.setState({ drawerOpen: false })
  }

  handleDrawerOpen() {
    this.setState({ drawerOpen: true })
  }
  render() {
    var divStyle = {}
    var props = {}
    if (this.state.drawerOpen) {
      props = { onClick: this.handleDrawerClose.bind(this) }
      divStyle = {
        zIndex: 10,
        opacity: 0.6,
        filter: "alpha(opacity=60)",
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "black",
      }
    }
    return (
      <div>
        <ToastContainer
          store={ToastStore}
          lightBackground
          position={ToastContainer.POSITION.TOP_CENTER}
        />
        <CssBaseline />
        <RepoList open={this.state.drawerOpen} />
        <div style={divStyle} {...props} />
        <div
          id="repoName"
          style={{
            position: "relative",
            height: "100%",
            backgroundColor: purple[800],
            color: "white",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen.bind(this)}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Button mini color="inherit" href="/" style={{ clear: "both" }}>
            <img width="24" height="24" src="/logo-reverse.png" alt="home" />
            <Typography color="inherit">tinyCI</Typography>
          </Button>
          <IconButton
            style={{ float: "right" }}
            color="inherit"
            href="/uisvc/logout"
          >
            <Icon>logout</Icon>
          </IconButton>
          <FilterDisplay />
          <ManualSubmitForm />
        </div>
        <div style={{ borderLeft: "1px solid #ccc" }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapActionsToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(Base)
