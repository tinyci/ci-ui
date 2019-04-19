import { getRefs } from "../models/ref"
import { receiveError } from "../actions/ui"

export const FETCH_REFS = "FETCH_REFS"
export const fetchRefs = (orgName, repoName) => {
  return dispatch => {
    getRefs(
      orgName,
      repoName,
      refs => {
        dispatch(receiveRefs(refs))
      },
      err => {
        dispatch(receiveError(err))
      },
    )
  }
}

export const RECEIVE_REFS = "RECEIVE_REFS"
export const receiveRefs = refs => {
  return { type: RECEIVE_REFS, refs }
}
