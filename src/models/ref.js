import { get } from "./models"

const paths = {
  list: "/uisvc/refs",
}

export const getRefs = (orgName, repoName, successCallback, errorCallback) => {
  const queryParams = { repository: orgName + "/" + repoName }
  get(paths.list, queryParams, successCallback, errorCallback)
}
