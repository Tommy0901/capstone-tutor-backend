'use strict'
const category = ['旅行與文化', '健康生活', '文法', '發音', '商務', '會話']

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      category.map(item => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null)
  }
}
