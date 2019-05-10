import axios from "axios"
import querystring from "query-string"

export const get = (path, queryParams, successCallback, errorCallback) => {
  const queryString = querystring.stringify(queryParams)
  return axios
    .get(path + "?" + queryString, { withCredentials: true })
    .then(res => {
      if (typeof successCallback == "function") {
        successCallback(res.data)
      } else if (successCallback !== undefined) {
        console.error(
          "Expected function for successCallback, got " +
            typeof successCallback +
            ":",
          successCallback,
        )
      }
    })
    .catch(errorCallback)
}
