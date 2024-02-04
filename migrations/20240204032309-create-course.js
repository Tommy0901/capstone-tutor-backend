'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Courses (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      teacher_id INT NOT NULL,
      category_id INT NOT NULL,
      name VARCHAR(80) NOT NULL,
      intro TEXT NOT NULL,
      link VARCHAR(255) NOT NULL,
      duration INT NOT NULL,
      price INT DEFAULT 0 NOT NULL,
      image VARCHAR(255),
      start_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT courses_fk_user_id FOREIGN KEY (teacher_id) REFERENCES Users(id),
      CONSTRAINT courses_fk_category_id FOREIGN KEY (category_id) REFERENCES Categories(id) ON UPDATE CASCADE
    )`)
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP TABLE IF EXISTS Courses`
    )
  }
}
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.createTable('Courses', {
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
//       name: {
//         type: Sequelize.STRING
//       },
//       intro: {
//         type: Sequelize.STRING
//       },
//       link: {
//         type: Sequelize.STRING
//       },
//       duration: {
//         type: Sequelize.NUMBER
//       },
//       price: {
//         type: Sequelize.NUMBER
//       },
//       image: {
//         type: Sequelize.STRING
//       },
//       start_at: {
//         type: Sequelize.DATE
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
//     await queryInterface.dropTable('Courses')
//   }
// }
