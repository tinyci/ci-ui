import React from "react"
import Icon from "@material-ui/core/Icon"
import Typography from "@material-ui/core/Typography"

const copyToClipboard = str => {
  const el = document.createElement("textarea")
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

class CopyItem extends React.Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="subtitle">
          {this.props.displayItem || this.props.item}
          <Icon
            onClick={() => {
              copyToClipboard(this.props.item)
            }}
            style={{
              paddingLeft: "5px",
              verticalAlign: "middle",
              display: "inline",
              cursor: "pointer",
              fontSize: "1em",
            }}
          >
            {this.props.icon || "file_copy"}
          </Icon>
        </Typography>
      </div>
    )
  }
}

export default CopyItem
