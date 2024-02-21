'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Course, { foreignKey: 'teacherId' })
      User.hasMany(models.Registration, { foreignKey: 'studentId' })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      nation: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
      avatar: DataTypes.STRING,
      totalStudy: DataTypes.NUMBER,
      isTeacher: DataTypes.BOOLEAN,
      teachStyle: DataTypes.STRING,
      selfIntro: DataTypes.TEXT,
      mon: DataTypes.BOOLEAN,
      tue: DataTypes.BOOLEAN,
      wed: DataTypes.BOOLEAN,
      thu: DataTypes.BOOLEAN,
      fri: DataTypes.BOOLEAN,
      sat: DataTypes.BOOLEAN,
      sun: DataTypes.BOOLEAN
    },
    {
      sequelize,
      underscored: true,
      modelName: 'User',
      tableName: 'Users'
    }
  )
  return User
}
