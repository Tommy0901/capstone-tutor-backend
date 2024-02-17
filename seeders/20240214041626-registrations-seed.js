'use strict'
const { faker } = require('@faker-js/faker')
const { currentTaipeiTime } = require('../helpers/time-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    const { SELECT } = sequelize.QueryTypes
    const [students, expiredCourses, upcomingCourses] = await Promise.all([
      sequelize.query(
        'SELECT id FROM Users WHERE is_teacher = 0;',
        { type: SELECT }
      ),
      sequelize.query(
        'SELECT id FROM Courses WHERE start_at < :todayDate;',
        { type: SELECT, replacements: { todayDate: currentTaipeiTime() } }
      ),
      sequelize.query(
        'SELECT id FROM Courses WHERE start_at >= :todayDate;',
        { type: SELECT, replacements: { todayDate: currentTaipeiTime() } }
      )
    ])
    const registrations = []

    registrations.push(...Array.from({ length: expiredCourses.length }, (_, i) => ({
      student_id: students[Math.ceil((i + 1) * students.length / expiredCourses.length) - 1].id,
      course_id: expiredCourses[i].id,
      rating: Math.ceil(Math.random() * 5),
      comment: faker.lorem.paragraph()
    })))

    registrations.push(...Array.from({ length: upcomingCourses.length }, (_, i) => ({
      student_id: students[Math.floor(Math.random() * students.length)].id,
      course_id: upcomingCourses[i].id
    })))

    await queryInterface.bulkInsert('Registrations', registrations)
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Registrations', null)
  }
}
