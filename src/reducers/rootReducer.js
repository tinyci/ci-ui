import { combineReducers } from "redux"
import { connectRouter } from "connected-react-router"

import runs from "./runs"
import repositories from "./repositories"
import users from "./users"
import tasks from "./tasks"
import refs from "./refs"
import ui from "./ui"

export default history =>
  combineReducers({
    router: connectRouter(history),
    runs,
    repositories,
    users,
    tasks,
    refs,
    ui,
  })
