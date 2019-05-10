const deslashify = str => {
  return encodeURIComponent(str)
}

const slashify = str => {
  return decodeURIComponent(str)
}

export { slashify, deslashify }
