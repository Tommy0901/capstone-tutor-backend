'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Category.hasMany(models.Course, { foreignKey: 'categoryId' })
    }
  }
  Category.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    underscored: true,
    modelName: 'Category',
    tableName: 'Categories'
  })
  return Category
}
