'use strict'
const category = ['多益', '托福', '雅思', '商用英文', '生活會話', '旅遊英文', '新聞英文']

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
  },
  category
}
