import { get } from "./models"

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
  return get(paths.my, queryParams, successCallback, errorCallback)
}

export const getSubscribedRepositories = (
  search,
  successCallback,
  errorCallback,
) => {
  const queryParams = { search }
  return get(paths.subscribed, queryParams, successCallback, errorCallback)
}

export const getVisibleRepositories = (
  search,
  successCallback,
  errorCallback,
) => {
  const queryParams = { search }
  return get(paths.visible, queryParams, successCallback, errorCallback)
}

export const addRepositoryToCI = (repoName, successCallback, errorCallback) => {
  const queryParams = {}
  return get(
    paths.addToCI(repoName),
    queryParams,
    successCallback,
    errorCallback,
  )
}

export const subscribeToRepository = (
  repoName,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  return get(
    paths.subscribeToRepository(repoName),
    queryParams,
    successCallback,
    errorCallback,
  )
}

export const removeRepositoryFromCI = (
  repoName,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  return get(
    paths.removeFromCI(repoName),
    queryParams,
    successCallback,
    errorCallback,
  )
}

export const unsubscribeFromRepository = (
  repoName,
  successCallback,
  errorCallback,
) => {
  const queryParams = {}
  return get(
    paths.unsubscribeFromRepository(repoName),
    queryParams,
    successCallback,
    errorCallback,
  )
}
