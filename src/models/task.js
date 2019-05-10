import { get } from "./models"

const paths = {
  list: "/uisvc/tasks",
  count: "/uisvc/tasksCount",
}

export const getTasks = (
  repository,
  refName,
  sha,
  currentPage,
  pageSize,
  successCallback,
  errorCallback,
) => {
  const queryParams = {
    repository,
    refName,
    sha,
    page: currentPage,
    perPage: pageSize,
  }
  get(paths.list, queryParams, successCallback, errorCallback)
}

export const getTaskCount = (
  repository,
  refName,
  sha,
  successCallback,
  errorCallback,
) => {
  const queryParams = { repository, refName, sha }
  get(paths.count, queryParams, successCallback, errorCallback)
}
