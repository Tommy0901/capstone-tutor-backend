module.exports = {
  booleanObjects (object) {
    const Arr = [...Object.values(object)]
    const filterdArr = Arr.filter(i => i === 'true' || i === 'false')
    return Arr.length === filterdArr.length
  },
  emptyObjectValues (object) {
    const Arr = [...Object.values(object)]
    const filterdArr = Arr.filter(i => i !== '' && i !== undefined && i !== null)
    return Arr.length === filterdArr.length
  }
}
