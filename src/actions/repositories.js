import {
  getSubscribedRepositories,
  getOwnedRepositories,
  getVisibleRepositories,
} from "../models/repository"

import { receiveError } from "../actions/ui"

export const FETCH_REPOSITORIES = "FETCH_REPOSITORIES"
export const fetchRepositories = search => {
  return dispatch => {
    dispatch(
      fetchOwnedRepositories(search, () => {
        // We want to fetch owned repositories first so visible is
        // properly populated when we query it. This will all be one
        // query when this ticket is implemented:
        // https://github.com/tinyci/ci-ui/issues/29
        dispatch(fetchSubscribedRepositories(search))
        dispatch(fetchVisibleRepositories(search))
      }),
    )
  }
}

export const FETCH_SUBSCRIBED_REPOSITORIES = "FETCH_SUBSCRIBED_REPOSITORIES"
export const fetchSubscribedRepositories = search => {
  return dispatch => {
    dispatch(incrementActiveRepositoriesRequests())
    getSubscribedRepositories(
      search,
      repositories => {
        dispatch(receiveSubscribedRepositories(repositories))
        dispatch(decrementActiveRepositoriesRequests())
      },
      err => {
        dispatch(receiveError(err))
        dispatch(decrementActiveRepositoriesRequests())
      },
    )
  }
}

export const RECEIVE_SUBSCRIBED_REPOSITORIES = "RECEIVE_SUBSCRIBED_REPOSITORIES"
export const receiveSubscribedRepositories = repositories => {
  return { type: RECEIVE_SUBSCRIBED_REPOSITORIES, subscribedList: repositories }
}

export const FETCH_OWNED_REPOSITORIES = "FETCH_OWNED_REPOSITORIES"
export const fetchOwnedRepositories = (search, callback) => {
  return dispatch => {
    dispatch(incrementActiveRepositoriesRequests())
    getOwnedRepositories(
      search,
      repositories => {
        callback()
        dispatch(receiveOwnedRepositories(repositories))
        dispatch(decrementActiveRepositoriesRequests())
      },
      err => {
        dispatch(receiveError(err))
        dispatch(decrementActiveRepositoriesRequests())
      },
    )
  }
}

export const RECEIVE_OWNED_REPOSITORIES = "RECEIVE_OWNED_REPOSITORIES"
export const receiveOwnedRepositories = repositories => {
  return { type: RECEIVE_OWNED_REPOSITORIES, ownedList: repositories }
}

export const FETCH_VISIBLE_REPOSITORIES = "FETCH_VISIBLE_REPOSITORIES"
export const fetchVisibleRepositories = search => {
  return dispatch => {
    dispatch(incrementActiveRepositoriesRequests())
    getVisibleRepositories(
      search,
      repositories => {
        dispatch(receiveVisibleRepositories(repositories))
        dispatch(decrementActiveRepositoriesRequests())
      },
      err => {
        dispatch(receiveError(err))
        dispatch(decrementActiveRepositoriesRequests())
      },
    )
  }
}

export const RECEIVE_VISIBLE_REPOSITORIES = "RECEIVE_VISIBLE_REPOSITORIES"
export const receiveVisibleRepositories = repositories => {
  return { type: RECEIVE_VISIBLE_REPOSITORIES, visibleList: repositories }
}

export const INCREMENT_ACTIVE_REPOSITORIES_REQUESTS =
  "INCREMENT_ACTIVE_REPOSITORIES_REQUESTS"
export const incrementActiveRepositoriesRequests = () => {
  return { type: INCREMENT_ACTIVE_REPOSITORIES_REQUESTS }
}

export const DECREMENT_ACTIVE_REPOSITORIES_REQUESTS =
  "DECREMENT_ACTIVE_REPOSITORIES_REQUESTS"
export const decrementActiveRepositoriesRequests = () => {
  return { type: DECREMENT_ACTIVE_REPOSITORIES_REQUESTS }
}
