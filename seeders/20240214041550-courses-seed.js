'use strict'
const { faker } = require('@faker-js/faker')
const { upcomingCourseDates, pastCourseDates } = require('../helpers/time-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    const { SELECT } = sequelize.QueryTypes
    const [teachers, categories] = await Promise.all([
      sequelize.query('SELECT id,mon,tue,wed,thu,fri,sat,sun FROM Users WHERE is_teacher = 1;', { type: SELECT }),
      sequelize.query('SELECT id FROM Categories;', { type: SELECT })
    ])
    const { length } = teachers
    const courses = []

    for (let i = 0; i < 2; i++) {
      courses.push(...Array.from({ length }, (_, i) => {
        const { id: teacher_id, ...whichDay } = teachers[i]
        const availableHours = pastCourseDates(whichDay)
        const start_at = availableHours[Math.floor(Math.random() * availableHours.length)]
        return {
          teacher_id,
          category_id: categories[Math.floor(Math.random() * categories.length)].id,
          name: faker.lorem.word(),
          intro: faker.lorem.paragraph(),
          link: faker.internet.url(),
          duration: Math.floor(Math.random() * 2) ? 30 : 60,
          start_at
        }
      }))
    }

    for (let i = 0; i < 2; i++) {
      courses.push(...Array.from({ length }, (_, i) => {
        const { id: teacher_id, ...whichDay } = teachers[i]
        const availableHours = upcomingCourseDates(whichDay)
        const start_at = availableHours[Math.floor(Math.random() * availableHours.length)]
        return {
          teacher_id,
          category_id: categories[Math.floor(Math.random() * categories.length)].id,
          name: faker.lorem.word(),
          intro: faker.lorem.paragraph(),
          link: faker.internet.url(),
          duration: Math.floor(Math.random() * 2) ? 30 : 60,
          start_at
        }
      }))
    }

    await queryInterface.bulkInsert('Courses', courses)
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Courses', null)
  }
}
