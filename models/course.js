'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Course.belongsTo(models.User, { foreignKey: 'teacherId' })
      Course.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Course.hasMany(models.Registration, { foreignKey: 'courseId' })
    }
  }
  Course.init({
    // teacherId: DataTypes.NUMBER,
    // categoryId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    intro: DataTypes.TEXT,
    link: DataTypes.STRING,
    duration: DataTypes.NUMBER,
    price: DataTypes.NUMBER,
    image: DataTypes.STRING,
    startAt: DataTypes.DATE
  }, {
    sequelize,
    underscored: true,
    modelName: 'Course',
    tableName: 'Courses'
  })
  return Course
}
