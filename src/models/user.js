import axios from "axios"

import querystring from "query-string"

const paths = {
  user: "/uisvc/user/properties",
}

export const getUser = (successCallback, errorCallback) => {
  const queryParams = {}
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(paths.user + "?" + queryString, { withCredentials: true })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}
