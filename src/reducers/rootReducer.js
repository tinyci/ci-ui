import { combineReducers } from "redux"
import { connectRouter } from "connected-react-router"

import runs from "./runs"
import repositories from "./repositories"
import users from "./users"
import ui from "./ui"

export default history =>
  combineReducers({
    router: connectRouter(history),
    runs,
    repositories,
    users,
    ui,
  })
