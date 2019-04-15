import initialState from "./initialState"

import {
  FETCH_SUBSCRIBED_REPOSITORIES,
  RECEIVE_SUBSCRIBED_REPOSITORIES,
  FETCH_OWNED_REPOSITORIES,
  RECEIVE_OWNED_REPOSITORIES,
  FETCH_VISIBLE_REPOSITORIES,
  RECEIVE_VISIBLE_REPOSITORIES,
} from "../actions/repositories"

export default (state = initialState.repositories, action) => {
  switch (action.type) {
    case FETCH_SUBSCRIBED_REPOSITORIES:
    case FETCH_OWNED_REPOSITORIES:
    case FETCH_VISIBLE_REPOSITORIES:
      return action
    case RECEIVE_SUBSCRIBED_REPOSITORIES:
      return { ...state, subscribedList: action.subscribedList }
    case RECEIVE_OWNED_REPOSITORIES:
      return { ...state, ownedList: action.ownedList }
    case RECEIVE_VISIBLE_REPOSITORIES:
      return { ...state, visibleList: action.visibleList }
    default:
      return state
  }
}
