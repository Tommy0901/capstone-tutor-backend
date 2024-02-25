
module.exports = {
  getOffset (limit = 6, page = 1) { return (page - 1) * limit }
}
