import { getTasks } from "../models/task"
import { receiveError } from "./ui"

export const FETCH_TASKS = "FETCH_TASKS"
export const fetchTasks = (orgName, repoName, refName) => dispatch => {
  getTasks(
    orgName,
    repoName,
    refName,
    tasks => dispatch(receiveTasks(tasks)),
    err => dispatch(receiveError(err)),
  )
}

export const RECEIVE_TASKS = "RECEIVE_TASKS"
export const receiveTasks = tasks => {
  console.log(tasks)
  return { type: RECEIVE_TASKS, tasks }
}
