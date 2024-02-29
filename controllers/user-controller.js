const { User, teaching_category, Category, Course, Registration, Admin } = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { errorMsg } = require('../middlewares/message-handler')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { imgurUpload } = require('../helpers/image-helpers')
const { booleanObjects } = require('../helpers/datatype-helpers')
const { currentTaipeiTime } = require('../helpers/time-helpers')

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { body: { name, email, password, passwordCheck } } = req
      if (!name || !email || !password) return errorMsg(res, 401, 'Please enter name, email and password!')
      if (password !== passwordCheck) return errorMsg(res, 401, 'Passwords do not match!')

      if (await User.findOne({ where: { email } })) return errorMsg(res, 401, 'Email already exists!')

      const createdUser = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
      const { password: removePassword, ...user } = createdUser.toJSON()
      user.updatedAt = currentTaipeiTime(user.updatedAt)
      user.createdAt = currentTaipeiTime(user.createdAt)
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { body: { password, email } } = req
      if (!password || !email) return errorMsg(res, 401, 'Please enter email and password!')

      const findOptions = { where: { email }, raw: true }
      const user = await User.findOne(findOptions) || await Admin.findOne(findOptions)
      if (!user) return errorMsg(res, 401, 'email 或密碼錯誤')

      await bcrypt.compare(password, user.password)
        ? res.json({
          status: 'success',
          data: {
            id: user.id,
            isTeacher: user.isTeacher,
            email,
            token: jwt.sign({ id: user.id, isTeacher: user.isTeacher }, process.env.JWT_SECRET, { expiresIn: '30d' })
          }
        })
        : errorMsg(res, 401, 'email 或密碼錯誤')
    } catch (err) {
      next(err)
    }
  },
  homepage: async (req, res, next) => {
    try {
      const { query: { categoryId, keyword } } = req
      const likeKeywordObject = { [Op.like]: `%${keyword}%` }
      const [name, nation, nickname, teachStyle, selfIntro] = Array.from({ length: 5 }, () => likeKeywordObject)
      const searchFields = [{ name }, { nation }, { nickname }, { teachStyle }, { selfIntro }]
      const limit = 6
      const page = req.query.page || 1
      const [teachers, students] = await Promise.all([
        User.findAndCountAll({
          attributes: ['id', 'name', 'nation', 'nickname', 'avatar', 'teachStyle', 'selfIntro'],
          where: {
            isTeacher: true,
            ...keyword ? { [Op.or]: searchFields } : {}
          },
          include: {
            model: teaching_category,
            attributes: ['categoryId'],
            ...categoryId ? { where: { categoryId } } : {},
            include: {
              model: Category,
              attributes: ['name']
            }
          },
          group: ['id'],
          limit,
          offset: getOffset(limit, page)
        }),
        Registration.findAll({
          attributes: [
            'studentId',
            [sequelize.fn('SUM', sequelize.col('Course.duration')), 'studyHours']
          ],
          include: [
            { model: User, attributes: ['name', 'nickname', 'avatar'] },
            { model: Course, attributes: [], where: { startAt: { [Op.lt]: new Date() } } }
          ],
          group: ['studentId'],
          limit: 10,
          order: [['studyHours', 'DESC']]
        })
      ])
      const ratingAverage = await Registration.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'ratingAverage']],
        include: { model: Course, attributes: [], where: { teacherId: { [sequelize.Op.in]: teachers.rows.map(i => i.dataValues.id) } } },
        where: { rating: { [Op.not]: null } },
        group: ['Course.teacher_id']
      })
      const data = { ...getPagination(limit, page, teachers.count.length) }
      teachers.rows
        .forEach((teacher, i) => { teacher.dataValues.ratingAverage = ratingAverage[i].dataValues.ratingAverage })
      data.teachers = teachers.rows
      data.students = students
        .map(student => {
          student.dataValues.studyHours = +student.dataValues.studyHours / 60
          return student
        })
      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  getStudent: async (req, res, next) => {
    try {
      const { params: { id } } = req
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'nickname', 'avatar', 'selfIntro'],
        include: {
          model: Registration,
          attributes: ['id', 'studentId', 'courseId', 'rating', 'comment'],
          include: {
            model: Course,
            attributes: ['id', 'teacherId', 'category', 'name', 'intro', 'image', 'link', 'startAt', 'duration']
          }
        }
      })
      if (!user) return errorMsg(res, 404, "Student didn't exist!")
      user.dataValues.Registrations = user.dataValues.Registrations
        .map(item => {
          item.dataValues.Course.dataValues.startAt = currentTaipeiTime(item.dataValues.Course.dataValues.startAt)
          return item
        })
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  editStudent: async (req, res, next) => {
    try {
      const { params: { id }, user: { id: userId } } = req
      if (+id !== userId) return errorMsg(res, 403, 'Permission denied!')
      const user = await User
        .findByPk(id, {
          attributes: ['id', 'name', 'email', 'nickname', 'avatar', 'selfIntro', 'createdAt', 'updatedAt'],
          raw: true
        })
      user.createdAt = currentTaipeiTime(user.createdAt)
      user.updatedAt = currentTaipeiTime(user.updatedAt)
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  putStudent: async (req, res, next) => {
    try {
      const { params: { id }, user: { id: userId }, body: { name, nickname, selfIntro }, file } = req
      if (+id !== userId) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')
      if (!name) return errorMsg(res, 401, 'Please enter name.')
      const [filePath, user] = await Promise.all([imgurUpload(file),
        User.findByPk(id, { attributes: ['id', 'name', 'email', 'nickname', 'avatar', 'selfIntro', 'createdAt', 'updatedAt'] })
      ])
      await user.update({ name, nickname, avatar: filePath || user.avatar, selfIntro })
      user.dataValues.createdAt = currentTaipeiTime(user.dataValues.createdAt)
      user.dataValues.updatedAt = currentTaipeiTime(user.dataValues.updatedAt)
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  patchTeacher: async (req, res, next) => {
    try {
      const { params: { id }, user: { id: userId, isTeacher } } = req
      if (isTeacher) return errorMsg(res, 403, 'Duplicate application for teacher. Update failed!')
      if (+id !== userId) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')
      await User.update({ isTeacher: true }, { where: { id } })
      const user = await User
        .findByPk(id, {
          attributes: ['id', 'name', 'email', 'isTeacher', 'createdAt', 'updatedAt'],
          raw: true
        })
      user.createdAt = currentTaipeiTime(user.createdAt)
      user.updatedAt = currentTaipeiTime(user.updatedAt)
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  getTeacher: async (req, res, next) => {
    try {
      const { params: { id } } = req
      const [user, registrations] = await Promise.all([
        User.findOne({
          where: { id, isTeacher: true },
          include: [{
            model: teaching_category,
            attributes: ['categoryId'],
            include: {
              model: Category,
              attributes: ['name']
            }
          }, {
            model: Course,
            attributes: ['id', 'teacherId', 'category', 'name', 'intro', 'image', 'link', 'startAt', 'duration'],
            include: { model: Registration, attributes: ['rating', 'comment'] }
          }]
        }),
        Registration.findAll({
          attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'ratingAverage']],
          include: { model: Course, attributes: [], where: { teacherId: id } },
          where: { rating: { [Op.not]: null } },
          group: ['Course.teacher_id']
        })
      ])
      if (!user) return errorMsg(res, 404, "Teacher didn't exist!")
      user.dataValues.Courses = user.dataValues.Courses
        .map(item => {
          item.dataValues.startAt = currentTaipeiTime(item.dataValues.startAt)
          return item
        })
      const { password, totalStudy, isTeacher, createdAt, updatedAt, ...data } = user.toJSON()
      data.ratingAverage = registrations[0] ? registrations[0].toJSON().ratingAverage : null
      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  editTeacher: async (req, res, next) => {
    try {
      const { params: { id }, user: { id: userId } } = req
      if (+id !== userId) return errorMsg(res, 403, 'Permission denied!')
      const user = await User.findByPk(id, {
        include: {
          model: teaching_category,
          attributes: ['categoryId'],
          include: {
            model: Category,
            attributes: ['name']
          }
        }
      })
      const { password, totalStudy, isTeacher, ...data } = user.toJSON()
      data.createdAt = currentTaipeiTime(data.createdAt)
      data.updatedAt = currentTaipeiTime(data.updatedAt)
      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  putTeacher: async (req, res, next) => {
    try {
      const { body: { name, nation, nickname, teachStyle, selfIntro, category } } = req
      const { body: { mon, tue, wed, thu, fri, sat, sun } } = req
      const whichDay = { mon, tue, wed, thu, fri, sat, sun }
      const hasDuplicates = category.filter((value, index, self) => self.indexOf(value) !== index).length > 0
      const { params: { id }, user: { id: userId }, file } = req

      if (+id !== userId) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')
      if (!name) return errorMsg(res, 401, 'Please enter name.')
      if (hasDuplicates) return errorMsg(res, 401, 'CategoryId has duplicates.')
      if (!booleanObjects(whichDay)) return errorMsg(res, 401, 'Which day input was invalid.')

      let categoryId = await Category.findAll({ raw: true })
      categoryId = categoryId.map(i => i.id)
      if (!category.every(i => categoryId.includes(i))) return errorMsg(res, 401, 'Please enter correct categoryId.')

      const [filePath, user] = await Promise.all([
        imgurUpload(file), User.findByPk(id), teaching_category.destroy({ where: { teacher_id: id } })
      ])

      const bulkCreateData = Array.from(
        { length: category.length },
        (_, i) => ({ teacherId: id, categoryId: category[i] })
      )
      const teachingCategory = await teaching_category.bulkCreate(bulkCreateData)
      const updateFields = { name, nation, nickname, teachStyle, selfIntro, ...whichDay }

      await user.update({ avatar: filePath || user.avatar, ...updateFields })

      const { password, totalStudy, isTeacher, ...data } = user.toJSON()
      data.category = teachingCategory.map(i => i.dataValues.categoryId)
      data.createdAt = currentTaipeiTime(data.createdAt)
      data.updatedAt = currentTaipeiTime(data.updatedAt)
      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  }
}
