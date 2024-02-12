'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
const { User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const count = await User.count()
    const hash = await bcrypt.hash('12345678', 10)
    const data = Array.from({ length: 34 }, (_, index) => {
      if (index < 10) {
        // Insert regular users
        return {
          name: `user-${index + 1}`,
          email: `user${index + 1}@example.com`,
          password: hash,
          nickname: faker.lorem.word(5),
          avatar: 'https://loremflickr.com/320/240/people/all',
          is_teacher: false,
          teach_style: '',
          self_intro: faker.lorem.paragraph(),
          mon: 0,
          tue: 0,
          wed: 0,
          thu: 0,
          fri: 0,
          sat: 0,
          sun: 0,
          created_at: new Date(),
          updated_at: new Date()
        }
      } else {
        // Insert teachers
        return {
          name: `teacher-${index - 9}`,
          email: `teacher${index - 9}@example.com`,
          password: hash,
          nickname: faker.lorem.word(5),
          avatar: 'https://loremflickr.com/320/240/people/all',
          is_teacher: true,
          teach_style: faker.lorem.paragraph(),
          self_intro: faker.lorem.paragraph(),
          mon: faker.datatype.boolean(),
          tue: faker.datatype.boolean(),
          wed: faker.datatype.boolean(),
          thu: faker.datatype.boolean(),
          fri: faker.datatype.boolean(),
          sat: faker.datatype.boolean(),
          sun: faker.datatype.boolean(),
          created_at: new Date(),
          updated_at: new Date()
        }
      }
    })

    if (count === 0) {
      await queryInterface.bulkInsert('Users', data)
    }
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', null)
  }
}
