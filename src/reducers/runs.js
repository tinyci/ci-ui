import initialState from "./initialState"
import {
  FETCH_RUNS,
  RECEIVE_RUNS,
  RECEIVE_RUN_COUNT,
  SET_RUN_FILTERS,
  SET_RUN_REPOSITORY_FILTER,
} from "../actions/runs"

export default (state = initialState.runs, action) => {
  switch (action.type) {
    case FETCH_RUNS:
      return action
    case RECEIVE_RUNS:
      return { ...state, list: action.list, loading: false }
    case RECEIVE_RUN_COUNT:
      return { ...state, count: action.count }
    case SET_RUN_REPOSITORY_FILTER:
      return {
        ...state,
        filters: { ...state.filters, repository: action.repository },
      }
    case SET_RUN_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          repository: action.repository,
          sha: action.sha,
          taskID: action.taskID,
          currentPage: action.currentPage,
          pageSize: action.pageSize,
        },
      }
    default:
      return state
  }
}
