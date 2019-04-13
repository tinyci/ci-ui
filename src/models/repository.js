import axios from "axios"

import querystring from "query-string"

const paths = {
  my: "/uisvc/repositories/my",
  subscribed: "/uisvc/repositories/subscribed",
  visible: "/uisvc/repositories/visible",
  addToCI: repoName => "/uisvc/repositories/ci/add/" + repoName,
  removeFromCI: repoName => "/uisvc/repositories/ci/del/" + repoName,
  subscribeToRepository: repoName => "/uisvc/repositories/sub/add/" + repoName,
  unsubscribeFromRepository: repoName =>
    "uisvc/repositories/sub/del/" + repoName,
}

export const getOwnedRepositories = (
  search,
  successCallback,
  errorCallback,
) => {
  const queryParams = { transfer: true, all: true, watching: "my", search }
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.my + "?" + queryString, { withCredentials: true })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}

export const getSubscribedRepositories = (
  search,
  successCallback,
  errorCallback,
) => {
  const queryParams = { search }
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.subscribed + "?" + queryString, { withCredentials: true })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}

export const getVisibleRepositories = (
  search,
  successCallback,
  errorCallback,
) => {
  const queryParams = { search }
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.visible + "?" + queryString, { withCredentials: true })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}

export const addRepositoryToCI = (repoName, successCallback, errorCallback) => {
  const queryParams = {}
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.addToCI(repoName) + "?" + queryString, { withCredentials: true })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}

export const subscribeToRepository = (
  repoName,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.subscribeToRepository(repoName) + "?" + queryString, {
      withCredentials: true,
    })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}

export const removeRepositoryFromCI = (
  repoName,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.removeFromCI(repoName) + "?" + queryString, {
      withCredentials: true,
    })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}

export const unsubscribeFromRepository = (
  repoName,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.unsubscribeFromRepository(repoName) + "?" + queryString, {
      withCredentials: true,
    })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}
