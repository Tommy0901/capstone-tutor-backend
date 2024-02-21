module.exports = {
  booleanObjects (object) {
    const Arr = [...Object.values(object)]
    const filterdArr = Arr.filter(i => i === 'true' || i === 'false')
    return Arr.length === filterdArr.length
  }
}
