import { combineReducers } from "redux"
import runs from "./runs"
import repositories from "./repositories"
import users from "./users"
import ui from "./ui"

export default combineReducers({ runs, repositories, users, ui })
