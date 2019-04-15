import initialState from "./initialState"

import { FETCH_USER, RECEIVE_USER } from "../actions/users"

export default (state = initialState.users, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action
    case RECEIVE_USER:
      return { ...state, username: action.username }
    default:
      return state
  }
}
