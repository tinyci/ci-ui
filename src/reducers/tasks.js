import initialState from "./initialState"

import {
  FETCH_TASKS,
  RECEIVE_TASKS,
  RECEIVE_TASK_COUNT,
  SET_TASK_FILTERS,
} from "../actions/tasks"

export default (state = initialState.tasks, action) => {
  switch (action.type) {
    case FETCH_TASKS:
      return action
    case RECEIVE_TASKS:
      return { ...state, list: action.tasks }
    case RECEIVE_TASK_COUNT:
      return { ...state, count: action.count }
    case SET_TASK_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.filters } }
    default:
      return state
  }
}
