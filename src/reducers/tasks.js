import initialState from "./initialState"

import { FETCH_TASKS, RECEIVE_TASKS } from "../actions/tasks"

export default (state = initialState.tasks, action) => {
  switch (action.type) {
    case FETCH_TASKS:
      return action
    case RECEIVE_TASKS:
      return { ...state, list: action.tasks }
    default:
      return state
  }
}
