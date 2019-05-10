import { getTasks, getTaskCount } from "../models/task"
import { receiveError } from "./ui"

export const FETCH_TASKS = "FETCH_TASKS"
export const fetchTasks = (
  repository,
  refName,
  sha,
  currentPage,
  pageSize,
) => dispatch => {
  dispatch(setTaskFilters(repository, refName, sha, currentPage, pageSize))
  getTaskCount(
    repository,
    refName,
    sha,
    count => dispatch(receiveTaskCount(count)),
    err => dispatch(receiveError(err)),
  )

  getTasks(
    repository,
    refName,
    sha,
    currentPage,
    pageSize,
    tasks => dispatch(receiveTasks(tasks)),
    err => dispatch(receiveError(err)),
  )
}

export const RECEIVE_TASKS = "RECEIVE_TASKS"
export const receiveTasks = tasks => {
  return { type: RECEIVE_TASKS, tasks }
}

export const RECEIVE_TASK_COUNT = "RECEIVE_TASK_COUNT"
export const receiveTaskCount = count => {
  return { type: RECEIVE_TASK_COUNT, count }
}

export const SET_TASK_FILTERS = "SET_TASK_FILTERS"
export const setTaskFilters = (
  repository,
  refName,
  sha,
  currentPage,
  pageSize,
) => {
  return {
    type: SET_TASK_FILTERS,
    filters: { repository, refName, sha, currentPage, pageSize },
  }
}
