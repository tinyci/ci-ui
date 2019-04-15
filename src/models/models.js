import axios from "axios"
import querystring from "query-string"

export const get = (path, queryParams, successCallback, errorCallback) => {
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(path + "?" + queryString, { withCredentials: true })
    .then(res => {
      successCallback(res.data)
    })
    .catch(errorCallback)
}
