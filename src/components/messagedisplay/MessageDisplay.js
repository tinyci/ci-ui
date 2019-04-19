import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Typography from "@material-ui/core/Typography"
import { ToastStore } from "react-toasts"

import BaseComponent from "../../base_component.js"

import * as uiActions from "../../actions/ui"

class MessageDisplay extends BaseComponent {
  render() {
    if (this.props.errorMessage) {
      ToastStore.error(
        <div style={{ width: 300 }}>
          <Typography variant="title">{this.props.errorMessage}</Typography>
        </div>,
      )
      console.error(this.props.errorMessage)
      this.props.uiActions.clearError()
    }
    if (this.props.successMessage) {
      ToastStore.success(
        <div style={{ width: 300 }}>
          <Typography variant="title">{this.props.successMessage}</Typography>
        </div>,
      )
      this.props.uiActions.clearSuccess()
    }

    return <span id="error-display" />
  }
}
const mapStateToProps = state => {
  return {
    errorMessage: state.ui.errorMessage,
    successMessage: state.ui.successMessage,
  }
}
const mapDispatchToProps = dispatch => {
  return { uiActions: bindActionCreators(uiActions, dispatch) }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageDisplay)
