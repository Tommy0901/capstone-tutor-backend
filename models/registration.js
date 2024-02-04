'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Registration.belongsTo(models.User, { foreignKey: 'studentId' })
      Registration.belongsTo(models.Course, { foreignKey: 'courseId' })
    }
  }
  Registration.init({
    // studentId: DataTypes.NUMBER,
    // courseId: DataTypes.NUMBER,
    rating: DataTypes.NUMBER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    underscored: true,
    modelName: 'Registration',
    tableName: 'Registrations'
  })
  return Registration
}
