'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Categories (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      name VARCHAR(80) UNIQUE NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP TABLE IF EXISTS Categories`
    )
  }
}
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.createTable('Categories', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       name: {
//         type: Sequelize.STRING
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
//     await queryInterface.dropTable('Categories')
//   }
// }
