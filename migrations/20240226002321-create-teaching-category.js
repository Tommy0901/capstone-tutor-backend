'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS teaching_categories (
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        teacher_id INT NOT NULL,
        category_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT teaching_categories_fk_user_id FOREIGN KEY (teacher_id) REFERENCES Users(id),
        CONSTRAINT teaching_categories_fk_category_id FOREIGN KEY (category_id) REFERENCES Categories(id) ON UPDATE CASCADE
      )`
    )
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS teaching_categories`
    )
  }
}
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.createTable('teaching_categories', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       teacher_id: {
//         type: Sequelize.NUMBER
//       },
//       category_id: {
//         type: Sequelize.NUMBER
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     })
//   },
//   async down (queryInterface, Sequelize) {
//     await queryInterface.dropTable('teaching_categories')
//   }
// }
