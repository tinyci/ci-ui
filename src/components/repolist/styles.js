// This component is styled with javascript-type CSS because that was
// the only reliable way I could find to change the colors of button
// components in material UI. If it's true that Material UI generally
// expects this type of component styling, we should switch all
// components to be this sort of styling.
export default theme => ({
  control: {
    fontSize: "10pt",
    lineHeight: "38px",
  },
  controlButtons: {
    float: "right",
  },
  controlButton: {
    padding: "5px",
    width: "85px",
    fontSize: "8pt",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#81C684",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#4caf50",
    },
  },
  subscribeButton: {
    backgroundColor: "#567458",
    "&:hover": {
      backgroundColor: "#365438",
    },
    width: "85px",
  },
  unsubscribeButton: {
    backgroundColor: "#365438",
    "&:hover": {
      backgroundColor: "#567458",
    },
  },
  deleteIcon: {
    position: "relative",
    top: "6px",
    color: "#9E9090",
    cursor: "pointer",
  },
  repoName: {},
  addedRepoName: {
    color: "#81C684",
  },
})
