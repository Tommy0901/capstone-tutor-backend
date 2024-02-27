'use strict'
const { category } = require('./20240211090137-categories-seed')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    const { SELECT } = sequelize.QueryTypes
    const teaching_categories = []
    const teachers = await sequelize.query('SELECT id FROM Users WHERE is_teacher = 1;', { type: SELECT })
    const { length } = teachers

    teaching_categories.push(...Array.from({ length }, (_, i) => ({
      teacher_id: teachers[i].id,
      category_id: Math.ceil(Math.random() * category.length)
    })))

    const deDuplicateCategories = teaching_categories.map(item => item.category_id)

    teaching_categories.push(...Array.from({ length }, (_, i) => {
      const randomNumber = Math.floor(Math.random() * length)
      let categoryId = Math.ceil(Math.random() * category.length)
      do { categoryId = Math.ceil(Math.random() * category.length) }
      while (categoryId === deDuplicateCategories[randomNumber]) // 避免 seed 幫同一位老師建立重覆的 categoyId
      return {
        teacher_id: teachers[randomNumber].id,
        category_id: categoryId
      }
    }))

    await queryInterface.bulkInsert('teaching_categories', teaching_categories)
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('teaching_categories', null)
  }
}
