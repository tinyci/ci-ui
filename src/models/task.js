import { get } from "./models"

const paths = {
  list: "/tasks",
}

export const getTasks = (orgName, repoName, successCallback, errorCallback) => {
  const queryParams = { repository: orgName + "/" + repoName }
  get(paths.list, queryParams, successCallback, errorCallback)
}
