import React from "react"

class BaseComponent extends React.Component {
  getAndUpdateState(url, initialState, successFunc, errorFunc) {
    if (initialState && Object.keys(initialState).length > 0) {
      this.setState(initialState)
    }

    window
      .fetch(url, { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.json().then(res => res))
        }
        return res.json()
      })
      .then(result => successFunc(result))
      .catch(error => {
        if (typeof error === Promise) {
          error.then(res => errorFunc(res))
        } else {
          errorFunc(error)
        }
      })
  }

  getHeight = divs => {
    if (divs) {
      return (
        window.innerHeight -
        divs.reduce((x, item) => {
          if (!Number.isInteger(x)) {
            x = document.getElementById(x).offsetHeight
          }

          var elem = document.getElementById(item)
          if (elem) {
            return x + elem.offsetHeight
          }
          return x
        })
      )
    } else {
      return window.innerHeight
    }
  }

  apiUrl = path_component => {
    if (process.env.REACT_APP_API_PATH !== undefined) {
      path_component = process.env.REACT_APP_API_PATH + path_component
    }

    if (process.env.REACT_APP_API_URL !== undefined) {
      return process.env.REACT_APP_API_URL + path_component
    }

    return path_component
  }

  wsUrl = path_component => {
    if (process.env.REACT_APP_API_PATH !== undefined) {
      path_component = process.env.REACT_APP_API_PATH + path_component
    }

    if (process.env.REACT_APP_WS_URL !== undefined) {
      return process.env.REACT_APP_WS_URL + path_component
    }

    var loc = new URL(document.location)
    if (loc.protocol === "https") {
      loc.protocol = "wss"
    } else {
      loc.protocol = "ws"
    }

    loc.pathname = path_component

    return loc.toString()
  }
}

export default BaseComponent
