'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
const { User } = require('../models')
const { uploadImageToGCS, deleteFileInGCS } = require('../helpers/image-helpers')
const onePieceCharacters = require('../config/one-piece')

const countries = require('../config/conuntries')
const countryCodes = Object.keys(countries)
const API_URL = 'https://loremflickr.com/320/240/people'

const availableDays = [
  { mon: 1, tue: 1, wed: 1, thu: 0, fri: 0, sat: 0, sun: 0 },
  { mon: 1, tue: 0, wed: 1, thu: 0, fri: 1, sat: 0, sun: 1 },
  { mon: 0, tue: 1, wed: 0, thu: 1, fri: 0, sat: 1, sun: 0 },
  { mon: 0, tue: 0, wed: 1, thu: 1, fri: 1, sat: 0, sun: 0 },
  { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0, sat: 1, sun: 1 }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const count = await User.count()
    const hash = await bcrypt.hash('12345678', 10)
    await Promise.all(Array.from({ length: 34 }).map((_, i) => (uploadImageToGCS(API_URL + `?/random=${Math.random() * 100}`, i + 1 + count))))
    const data = Array.from({ length: 34 }, (_, index) => {
      if (index < 10) {
        // Insert regular users
        return {
          name: onePieceCharacters[index],
          nation: countryCodes[Math.floor(Math.random() * countryCodes.length)],
          email: `user${index + 1}@example.com`,
          password: hash,
          nickname: faker.lorem.word(5),
          avatar: `https://storage.googleapis.com/test_upload_image/${index + 1 + count}.jpg`,
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
          name: onePieceCharacters[index],
          nation: countryCodes[Math.floor(Math.random() * countryCodes.length)],
          email: `teacher${index - 9}@example.com`,
          password: hash,
          nickname: faker.lorem.word(5),
          avatar: `https://storage.googleapis.com/test_upload_image/${index + 1 + count}.jpg`,
          is_teacher: true,
          teach_style: faker.lorem.paragraph(),
          self_intro: faker.lorem.paragraph(),
          ...availableDays[Math.floor(Math.random() * availableDays.length)],
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
    const count = await User.count()
    for (let i = 0; i < 34; i++) {
      deleteFileInGCS(count - i)
    }
    await queryInterface.bulkDelete('Users', null)
  }
}
