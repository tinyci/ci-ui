import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Button from "@material-ui/core/Button"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"

import BaseComponent from "../../base_component"
import {
  addRepositoryToCI,
  removeRepositoryFromCI,
  subscribeToRepository,
  unsubscribeFromRepository,
} from "../../models/repository"

import * as repositoryActions from "../../actions/repositories"
import * as uiActions from "../../actions/ui"

import styles from "./styles.js"

class RepositoryControl extends BaseComponent {
  onClickAdd = repoName => {
    addRepositoryToCI(
      repoName,
      () => this.props.onRepositoryChanged(repoName),
      this.props.uiActions.processError,
    )
  }
  onClickSubscribe = repoName => {
    subscribeToRepository(
      repoName,
      () => this.props.onRepositoryChanged(repoName),
      this.props.uiActions.processError,
    )
  }
  onClickRemove = repoName => {
    console.log(this.props)
    removeRepositoryFromCI(
      repoName,
      () => this.props.onRepositoryChanged(repoName),
      this.props.uiActions.processError,
    )
  }
  onClickUnsubscribe = repoName => {
    unsubscribeFromRepository(
      repoName,
      () => this.props.onRepositoryChanged(repoName),
      this.props.uiActions.processError,
    )
  }
  render() {
    const { classes, repository, added, subscribed } = this.props
    return (
      <div className={classes.control}>
        {this.showIf(
          added,
          <DeleteForeverIcon
            className={classNames(classes.deleteIcon)}
            onClick={() => this.onClickRemove(repository.name)}
          />,
        )}
        <span
          className={classNames(
            added ? classes.addedRepoName : "",
            classes.repoName,
          )}
        >
          {repository.name}
        </span>
        <div className={classNames(classes.controlButtons)}>
          {this.showIf(
            !added,
            <Button
              variant="contained"
              color="primary"
              className={classNames(classes.addButton, classes.controlButton)}
              onClick={() => this.onClickAdd(repository.name)}
            >
              Add
            </Button>,
          )}
          {this.showIf(
            subscribed,
            <Button
              variant="contained"
              color="primary"
              className={classNames(
                classes.unsubscribeButton,
                classes.controlButton,
              )}
              onClick={() => this.onClickUnsubscribe(repository.name)}
            >
              Unsubscribe
            </Button>,
          )}
          {this.showIf(
            !subscribed,
            <Button
              variant="contained"
              color="secondary"
              className={classNames(
                classes.subscribeButton,
                classes.controlButton,
              )}
              onClick={() => this.onClickSubscribe(repository.name)}
            >
              Subscribe
            </Button>,
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapActionsToProps = dispatch => {
  return {
    repositoryActions: bindActionCreators(repositoryActions, dispatch),
    uiActions: bindActionCreators(uiActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withStyles(styles)(RepositoryControl))
