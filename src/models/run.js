import axios from "axios"
import querystring from "query-string"
const paths = { list: "/uisvc/runs", count: "/uisvc/runs/count" }

export const getRuns = (
  successCallback,
  errorCallback,
  page,
  perPage,
  repository,
  sha,
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
  const queryString = querystring.stringify(queryParams)

  return axios
    .get(paths.list + "?" + queryString, { withCredentials: true })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}

export const getRunCount = (
  successCallback,
  errorCallback,
  repository,
  sha,
) => {
  const queryParams = {}
  if (repository) {
    queryParams.repository = repository
  }
  if (sha) {
    queryParams.sha = sha
  }
  const queryString = querystring.stringify(queryParams)

  return axios
    .get(paths.count + "?" + queryString, {
      withCredentials: true,
    })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}
