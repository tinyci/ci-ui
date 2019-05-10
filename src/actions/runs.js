import {
  getRuns,
  getRunCount,
  getTaskRuns,
  getTaskRunCount,
} from "../models/run"
import { receiveError } from "./ui"

export const FETCH_TASK_RUNS = "FETCH_TASK_RUNS"
export const fetchTaskRuns = (
  currentPage,
  pageSize,
  taskID,
  callback,
) => dispatch => {
  dispatch(setRunFilters(currentPage, pageSize, undefined, undefined, taskID))
  getTaskRuns(
    currentPage,
    pageSize,
    taskID,
    runs => {
      dispatch(receiveRuns(runs))
      if (callback) callback()
    },
    err => {
      dispatch(receiveError(err))
    },
  )
  getTaskRunCount(
    taskID,
    count => {
      dispatch(receiveRunCount(count))
    },
    err => {
      dispatch(receiveError(err))
    },
  )
}

export const FETCH_RUNS = "FETCH_RUNS"
export const fetchRuns = (
  currentPage,
  pageSize,
  repository,
  sha,
  callback,
) => dispatch => {
  dispatch(setRunFilters(currentPage, pageSize, repository, sha, undefined))
  getRuns(
    currentPage,
    pageSize,
    repository,
    sha,
    runs => {
      dispatch(receiveRuns(runs))
      if (callback !== undefined) callback()
    },
    err => {
      dispatch(receiveError(err))
    },
  )
  getRunCount(
    repository,
    sha,
    count => {
      dispatch(receiveRunCount(count))
    },
    err => {
      dispatch(receiveError(err))
    },
  )
}

export const RECEIVE_RUNS = "RECEIVE_RUNS"
export const receiveRuns = list => {
  return { type: RECEIVE_RUNS, list }
}

export const RECEIVE_RUN_COUNT = "RECEIVE_RUN_COUNT"
export const receiveRunCount = count => {
  return { type: RECEIVE_RUN_COUNT, count }
}

export const SET_RUN_FILTERS = "SET_RUN_FILTERS"
export const setRunFilters = (currentPage, pageSize, repository, sha) => {
  return { type: SET_RUN_FILTERS, currentPage, pageSize, repository, sha }
}

// sometimes we just want to set the repository... don't require the caller to have everything on hand to do so.
export const SET_RUN_REPOSITORY_FILTER = "SET_RUN_REPOSITORY_FILTER"
export const setRunRepositoryFilter = repository => {
  return { type: SET_RUN_REPOSITORY_FILTER, repository }
}
