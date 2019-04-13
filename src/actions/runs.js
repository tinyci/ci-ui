import { getRuns, getRunCount } from "../models/run"
import { receiveError } from "./ui"

export const FETCH_RUNS = "FETCH_RUNS"
export const fetchRuns = (currentPage, pageSize, repository, sha) => {
  return dispatch => {
    dispatch(setRunFilters(currentPage, pageSize, repository, sha))
    getRuns(
      runs => {
        dispatch(receiveRuns(runs))
      },
      err => {
        dispatch(receiveError(err))
      },
      currentPage,
      pageSize,
      repository,
      sha,
    )
    getRunCount(
      count => {
        dispatch(receiveRunCount(count))
      },
      err => {
        dispatch(receiveError(err))
      },
      repository,
      sha,
    )
  }
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
