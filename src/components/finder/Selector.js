import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import BaseComponent from "../../base_component"

import "./Selector.css"

class Selector extends BaseComponent {
  render() {
    return (
      <div
        className={
          "finder-selector " +
          this.showIf(this.props.selected, "finder-selector-selected")
        }
        onClick={
          this.props.selected ? this.props.onDeselect : this.props.onSelect
        }
      >
        {this.props.item}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Selector)
