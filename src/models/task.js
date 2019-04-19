import { get } from "./models"

const paths = {
  list: "/uisvc/tasks",
}

export const getTasks = (
  orgName,
  repoName,
  refName,
  successCallback,
  errorCallback,
) => {
  const queryParams = { repository: orgName + "/" + repoName, ref: refName }
  get(paths.list, queryParams, successCallback, errorCallback)
}
