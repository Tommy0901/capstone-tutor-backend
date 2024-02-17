const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
  currentTaipeiTime: () => // 找到台北時區
    dayjs().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),

  upcomingCourseDates (whichDay) {
    let newDay = dayjs().tz('Asia/Taipei')
    const afterTwoWeeks = newDay.add(14, 'day') // 未來兩周可上課的時間
    const startTime = '18:00:00'
    const endTime = '20:30:00'
    const futureCourseDates = []
    const timeInterval = 30 // minutes
    const availableDays = []

    if (whichDay.mon) availableDays.push(1)
    if (whichDay.tue) availableDays.push(2)
    if (whichDay.wed) availableDays.push(3)
    if (whichDay.thu) availableDays.push(4)
    if (whichDay.fri) availableDays.push(5)
    if (whichDay.sat) availableDays.push(6)
    if (whichDay.sun) availableDays.push(0)

    while (newDay.isBefore(afterTwoWeeks)) {
      newDay = newDay.add(1, 'day')
      if (availableDays.map(d => parseInt(d)).includes(newDay.day())) {
        let startingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${startTime}`)
        const endingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${endTime}`)
        while (startingTime.isBefore(endingTime)) {
          futureCourseDates.push(startingTime.format('YYYY-MM-DD HH:mm:ss'))
          startingTime = startingTime.add(parseInt(timeInterval), 'minute')
        }
      }
    }
    return futureCourseDates // 找出老師未來可上課的時間
  },

  pastCourseDates (whichDay) {
    let newDay = dayjs().tz('Asia/Taipei')
    const beforeLastMonth = newDay.subtract(30, 'day') // 過去30天內可上課的時間
    const startTime = '18:00:00'
    const endTime = '20:30:00'
    const pastCourseDates = []
    const timeInterval = 30 // minutes
    const availableDays = []

    if (whichDay.mon) availableDays.push(1)
    if (whichDay.tue) availableDays.push(2)
    if (whichDay.wed) availableDays.push(3)
    if (whichDay.thu) availableDays.push(4)
    if (whichDay.fri) availableDays.push(5)
    if (whichDay.sat) availableDays.push(6)
    if (whichDay.sun) availableDays.push(0)

    while (newDay.isAfter(beforeLastMonth)) {
      newDay = newDay.subtract(1, 'day')
      if (availableDays.map(d => parseInt(d)).includes(newDay.day())) {
        let startingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${startTime}`)
        const endingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${endTime}`)
        while (startingTime.isBefore(endingTime)) {
          pastCourseDates.push(startingTime.format('YYYY-MM-DD HH:mm:ss'))
          startingTime = startingTime.add(parseInt(timeInterval), 'minute')
        }
      }
    }
    return pastCourseDates // 找出老師過去可上課的時間
  },

  deDuplicateCourseDates (randomDatesArr, availableDates, limit, index) {
    if (randomDatesArr.length < limit) {
      randomDatesArr
        .push(availableDates[Math.floor(Math.random() * availableDates.length)])
      return randomDatesArr[index]
    } else {
      let randomDate = availableDates[Math.floor(Math.random() * availableDates.length)]
      do { randomDate = availableDates[Math.floor(Math.random() * availableDates.length)] }
      while (randomDate === randomDatesArr[index])
      return randomDate
    }
  }
}
