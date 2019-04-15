import initialState from "./initialState"

import {
  PROCESS_ERROR,
  RECEIVE_ERROR,
  PROCESS_SUCCESS,
  RECEIVE_SUCCESS,
} from "../actions/ui"

import {
  INCREMENT_ACTIVE_REPOSITORIES_REQUESTS,
  DECREMENT_ACTIVE_REPOSITORIES_REQUESTS,
} from "../actions/repositories"

export default (state = initialState.ui, action) => {
  switch (action.type) {
    case PROCESS_ERROR:
    case PROCESS_SUCCESS:
      return action
    case RECEIVE_ERROR:
      return { ...state, errorMessage: action.errorMessage }
    case RECEIVE_SUCCESS:
      return { ...state, successMessage: action.successMessage }
    case INCREMENT_ACTIVE_REPOSITORIES_REQUESTS:
      return {
        ...state,
        activeRepositoriesRequests: state.activeRepositoriesRequests + 1,
      }
    case DECREMENT_ACTIVE_REPOSITORIES_REQUESTS:
      return {
        ...state,
        activeRepositoriesRequests: Math.max(
          0,
          state.activeRepositoriesRequests - 1,
        ),
      }
    default:
      return state
  }
}
