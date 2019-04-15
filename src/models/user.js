import { get } from "./models"

const paths = {
  user: "/uisvc/user/properties",
}

export const getUser = (successCallback, errorCallback) => {
  const queryParams = {}
  return get(paths.user, queryParams, successCallback, errorCallback)
}
