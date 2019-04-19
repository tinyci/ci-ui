import React from "react"

export const PrNumberFormatter = ({ value }) => {
  if (value && value.pull_request_id) {
    return (
      <a
        href={
          "https://github.com/" + value.name + "/pull/" + value.pull_request_id
        }
      >
        {value.pull_request_id}
      </a>
    )
  } else {
    return "push"
  }
}

export const TimesFormatter = ({ value }) => {
  if (value === undefined) {
    return "undefined"
  }
  if (!value.started_at) {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } else if (value.started_at && !value.finished_at) {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>
                <b>Started:</b>
              </td>
              <td>{value.started_at}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <div>
        <table>
          <tr>
            <td>
              <b>Started At:</b>
            </td>
            <td>{value.started_at}</td>
          </tr>
          <tr>
            <td>
              <b>Finished At:</b>
            </td>
            <td>{value.finished_at}</td>
          </tr>
          <tr>
            <td>
              <b>Duration:</b>
            </td>
            <td>{value.duration}</td>
          </tr>
        </table>
      </div>
    )
  }
}
