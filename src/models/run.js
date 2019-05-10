import { get } from "./models"
const paths = {
  list: "/uisvc/runs",
  count: "/uisvc/runsCount",
  taskList: taskID => "/uisvc/tasks/" + taskID + "/runs",
  taskCount: taskID => "/uisvc/tasks/" + taskID + "/runsCount",
}

export const getTaskRuns = (
  page,
  perPage,
  taskID,
  successCallback,
  errorCallback,
) => {
  const queryParams = { page, perPage }
  return get(
    paths.taskList(taskID),
    queryParams,
    successCallback,
    errorCallback,
  )
}

export const getTaskRunCount = (taskID, successCallback, errorCallback) => {
  const queryParams = {}
  return get(paths.taskCount(taskID), queryParams)
}

export const getRuns = (
  page,
  perPage,
  repository,
  sha,
  successCallback,
  errorCallback,
) => {
  const queryParams = { page, perPage, repository, sha }
  return get(paths.list, queryParams, successCallback, errorCallback)
}

export const getRunCount = (
  repository,
  sha,
  successCallback,
  errorCallback,
) => {
  const queryParams = { repository, sha }
  return get(paths.count, queryParams, successCallback, errorCallback)
}
