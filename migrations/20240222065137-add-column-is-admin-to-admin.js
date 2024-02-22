'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE Admins
        ADD COLUMN is_admin TINYINT DEFAULT 1 NOT NULL AFTER password;
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE Admins
        DROP COLUMN is_admin;
    `)
  }
}
