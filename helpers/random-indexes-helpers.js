module.exports = {
  getRandomIndexes (maxIndex, count) {
    const indexes = []
    while (indexes.length < count) {
      const index = Math.floor(Math.random() * maxIndex)
      if (!indexes.includes(index)) {
        indexes.push(index)
      }
    }
    return indexes
  }
}
