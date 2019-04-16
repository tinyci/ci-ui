import { createBrowserHistory } from "history"
import { routerMiddleware } from "connected-react-router"
import { createStore, compose, applyMiddleware } from "redux"
import createRootReducer from "../reducers/rootReducer"
import thunk from "redux-thunk"

export const history = createBrowserHistory()

export default () => {
  return createStore(
    createRootReducer(history),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    compose(applyMiddleware(routerMiddleware(history), thunk)),
  )
}
