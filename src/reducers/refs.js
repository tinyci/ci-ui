import initialState from "./initialState"

import { FETCH_REFS, RECEIVE_REFS } from "../actions/refs"

export default (state = initialState.refs, action) => {
  switch (action.type) {
    case FETCH_REFS:
      return action
    case RECEIVE_REFS:
      console.log("REFS", action.refs)

      return { ...state, list: action.refs }
    default:
      return state
  }
}
