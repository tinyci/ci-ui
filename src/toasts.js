import React from "react"
import Typography from "@material-ui/core/Typography"
import { ToastStore } from "react-toasts"

const errorToast = str => {
  ToastStore.error(
    <div style={{ width: 300 }}>
      <Typography variant="title">{str}</Typography>
    </div>,
  )
}

const successToast = str => {
  ToastStore.success(
    <div style={{ width: 300 }}>
      <Typography variant="title">{str}</Typography>
    </div>,
  )
}

export { errorToast, successToast }
