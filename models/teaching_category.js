'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class teaching_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      teaching_category.belongsTo(models.User, { foreignKey: 'teacherId' })
      teaching_category.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  teaching_category.init({
    // teacher_id: DataTypes.NUMBER,
    // category_id: DataTypes.NUMBER
  }, {
    sequelize,
    underscored: true,
    modelName: 'teaching_category',
    tableName: 'teaching_categories'
  })
  return teaching_category
}
