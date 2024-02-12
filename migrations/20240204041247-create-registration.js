'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS Registrations (
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        rating INT,
        comment TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT registrations_fk_user_id FOREIGN KEY (student_id) REFERENCES Users(id),
        CONSTRAINT registrations_fk_courses_id FOREIGN KEY (course_id) REFERENCES Courses(id)
      )`
    )
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Registrations`
    )
  }
}
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.createTable('Registrations', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       student_id: {
//         type: Sequelize.NUMBER
//       },
//       course_id: {
//         type: Sequelize.NUMBER
//       },
//       rating: {
//         type: Sequelize.NUMBER
//       },
//       comment: {
//         type: Sequelize.TEXT
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
//     await queryInterface.dropTable('Registrations')
//   }
// }
