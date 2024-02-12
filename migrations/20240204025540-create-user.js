'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nickname VARCHAR(20),
        avatar VARCHAR(255),
        total_study INT DEFAULT 0 NOT NULL,
        is_teacher TINYINT DEFAULT 0 NOT NULL,
        teach_style VARCHAR(255),
        self_intro TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`
    )
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Users`
    )
  }
}
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Users', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       name: {
//         type: Sequelize.STRING
//       },
//       email: {
//         type: Sequelize.STRING
//       },
//       password: {
//         type: Sequelize.STRING
//       },
//       nickname: {
//         type: Sequelize.STRING
//       },
//       avatar: {
//         type: Sequelize.STRING
//       },
//       total_study: {
//         type: Sequelize.NUMBER
//       },
//       is_teacher: {
//         type: Sequelize.BOOLEAN
//       },
//       teach_style: {
//         type: Sequelize.STRING
//       },
//       self_intro: {
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
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Users');
//   }
// };
