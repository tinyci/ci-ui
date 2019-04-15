import { getUser } from "../models/user"
import { receiveError } from "./ui"

export const FETCH_USER = "FETCH_USER"
export const fetchUser = () => {
  return dispatch => {
    getUser(
      user => {
        dispatch(receiveUser(user))
      },
      err => {
        dispatch(receiveError(err))
      },
    )
  }
}

export const RECEIVE_USER = "RECEIVE_USER"
export const receiveUser = user => {
  return { type: RECEIVE_USER, username: user.username }
}
