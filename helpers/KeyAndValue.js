function KeyAndValue(data) {
  const keys = Object.keys(data)
  const values = Object.values(data)

  return {
    keys,
    values,
  }
}

module.exports = KeyAndValue
