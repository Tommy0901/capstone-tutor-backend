'use strict'
const { faker } = require('@faker-js/faker')
const { User, teaching_category, Category } = require('../models')
const { upcomingCourseDates, pastCourseDates, deDuplicateCourseDates } = require('../helpers/time-helpers')
const { getRandomIndexes } = require('../helpers/random-indexes-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userDatas = await User.findAll({
      attributes: ['id', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      include: {
        model: teaching_category,
        attributes: ['categoryId'],
        include: {
          model: Category,
          attributes: ['name']
        }
      },
      where: { isTeacher: true }
    })
    const teachers = userDatas.map(user => {
      const teachers = user.toJSON()
      teachers.teaching_categories = teachers.teaching_categories.map(obj => obj.Category.name)
      return teachers
    })
    const { length } = teachers
    const courses = []
    const historicalCourseDates = []
    const futureCourseDates = []

    for (let i = 0; i < 2; i++) {
      courses.push(...Array.from({ length }, (_, i) => {
        const { id: teacherId, teaching_categories: teachingCategories, ...whichDay } = teachers[i]
        const randomIndexes = getRandomIndexes(
          teachingCategories.length,
          Math.ceil(Math.random() * teachingCategories.length)
        )
        const category = JSON.stringify(randomIndexes.map(index => teachingCategories[index]))
        return {
          teacher_id: teacherId,
          category,
          name: faker.lorem.word(),
          intro: faker.lorem.paragraph(),
          link: faker.internet.url(),
          duration: Math.floor(Math.random() * 2) ? 30 : 60,
          image: 'https://fakeimg.pl/300/?text=course%20img',
          start_at: deDuplicateCourseDates(historicalCourseDates, pastCourseDates(whichDay), length, i)
        }
      }))
    }

    for (let i = 0; i < 2; i++) {
      courses.push(...Array.from({ length }, (_, i) => {
        const { id: teacherId, teaching_categories: teachingCategories, ...whichDay } = teachers[i]
        const randomIndexes = getRandomIndexes(
          teachingCategories.length,
          Math.ceil(Math.random() * teachingCategories.length)
        )
        const category = JSON.stringify(randomIndexes.map(index => teachingCategories[index]))
        return {
          teacher_id: teacherId,
          category,
          name: faker.lorem.word(),
          intro: faker.lorem.paragraph(),
          link: faker.internet.url(),
          duration: Math.floor(Math.random() * 2) ? 30 : 60,
          image: 'https://fakeimg.pl/300/?text=course%20img',
          start_at: deDuplicateCourseDates(futureCourseDates, upcomingCourseDates(whichDay), length, i)
        }
      }))
    }

    await queryInterface.bulkInsert('Courses', courses)
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Courses', null)
  }
}
