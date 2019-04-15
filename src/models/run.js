import { get } from "./models"
const paths = { list: "/uisvc/runs", count: "/uisvc/runs/count" }

export const getRuns = (
  page,
  perPage,
  repository,
  sha,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  if (page) {
    queryParams.page = page
  }
  if (perPage) {
    queryParams.perPage = perPage
  }
  if (repository) {
    queryParams.repository = repository
  }
  if (sha) {
    queryParams.sha = sha
  }
  return get(paths.list, queryParams, successCallback, errorCallback)
}

export const getRunCount = (
  repository,
  sha,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  if (repository) {
    queryParams.repository = repository
  }
  if (sha) {
    queryParams.sha = sha
  }

  return get(paths.count, queryParams, successCallback, errorCallback)
}
