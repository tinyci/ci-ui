import { push } from "connected-react-router"

// processError and processSuccess only exist so we can bind this via
// mapDispatchToProps
export const PROCESS_ERROR = "PROCESS_ERROR"
export const processError = errorMessage => {
  return dispatch => {
    dispatch(receiveError(errorMessage))
  }
}

export const RECEIVE_ERROR = "RECEIVE_ERROR"
export const receiveError = errorMessage => {
  if (typeof errorMessage === "object") {
    const error = errorMessage
    if (error.response) {
      errorMessage = "[" + error.response.statusText + "]"
      if (error.response.data.errors) {
        errorMessage += ":\n" + error.response.data.errors.join(", ")
      }
    } else {
      errorMessage = "tinyCI uisvc unreachable"
    }
  }

  return { type: RECEIVE_ERROR, errorMessage: errorMessage }
}

export const PROCESS_SUCCESS = "PROCESS_SUCCESS"
export const processSuccess = successMessage => {
  return dispatch => {
    dispatch(receiveSuccess(successMessage))
  }
}

export const RECEIVE_SUCCESS = "RECEIVE_SUCCESS"
export const receiveSuccess = successMessage => {
  return { type: RECEIVE_SUCCESS, successMessage: successMessage }
}

export const clearError = () => {
  return processError("")
}
export const clearSuccess = () => {
  return processSuccess("")
}

export const navigateTo = (location, callback) => {
  return dispatch => {
    dispatch(push(location))
    return Promise.resolve()
  }
}
