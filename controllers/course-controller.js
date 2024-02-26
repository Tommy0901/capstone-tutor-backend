const { Course, User, Category, Registration } = require('../models')
const { Op } = require('sequelize')
const { errorMsg } = require('../middlewares/message-handler')
const { imgurUpload } = require('../helpers/image-helpers')
const { getOffset } = require('../helpers/pagination-helper')
const { emptyObjectValues } = require('../helpers/datatype-helpers')
const { formatCourseDate } = require('../helpers/time-helpers')

module.exports = {
  getCourses: async (req, res, next) => {
    try {
      const { query: { categoryId, keyword }, user: { id } } = req
      const limit = 6
      const page = req.query.page || 1
      const [courses, user] = await Promise.all([
        Course.findAll({
          attributes: ['id', 'teacherId', 'categoryId', 'name', 'intro', 'link', 'duration', 'image', 'startAt'],
          where: {
            ...(categoryId ? { categoryId } : {}),
            ...(keyword ? { [Op.like]: `%${keyword}%` } : {})
          },
          include: [Category],
          order: [['createdAt', 'DESC']],
          limit,
          offset: getOffset(limit, page),
          raw: true,
          nest: true
        }),
        User.findByPk(id, { raw: true })
      ])
      if (user.isTeacher) return errorMsg(res, 403, 'Permission denied! Because you are teacher.')
      res.json({ status: 'success', data: courses })
    } catch (err) {
      next(err)
    }
  },
  postCourse: async (req, res, next) => {
    try {
      const { user: { id, isTeacher } } = req
      const { body: { categoryId, name, intro, link, duration, startAt }, file } = req

      if (!isTeacher) return errorMsg(res, 401, 'Insufficient permission. Unable to create a new course!')

      const filePath = await imgurUpload(file) || ''
      const missingField = { categoryId, name, intro, link, duration, startAt }
      if (!emptyObjectValues(missingField)) return errorMsg(res, 400, 'All fields are required') // 找出沒有填寫的欄位

      const createdCourse = await Course.create({
        teacherId: id,
        categoryId,
        name,
        intro,
        link,
        duration,
        image: filePath,
        startAt
      })

      createdCourse.dataValues.startAt = formatCourseDate(createdCourse.dataValues.startAt)
      const { createdAt, updatedAt, ...rest } = createdCourse.dataValues
      createdCourse.dataValues = rest

      res.json({ status: 'success', data: createdCourse })
    } catch (error) {
      next(error)
    }
  },
  getCourse: async (req, res, next) => {
    try {
      const { params: { courseId: id } } = req
      const course = await Course.findByPk(id, {
        attributes: ['id', 'teacherId', 'categoryId', 'name', 'intro', 'link', 'duration', 'image', 'startAt'],
        include: [{
          model: Registration,
          attributes: ['id', 'studentId', 'rating', 'comment'],
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            attributes: ['id', 'name']
          }]
        }]
      })
      if (!course) return errorMsg(res, 404, "Course didn't exist!")
      course.dataValues.startAt = formatCourseDate(course.dataValues.startAt)

      res.json({ status: 'success', data: course })
    } catch (err) {
      next(err)
    }
  },
  putCourse: async (req, res, next) => {
    try {
      const { params: { courseId: id }, user: { id: teacherId } } = req
      const { body: { categoryId, name, intro, link, duration, startAt }, file } = req

      const [filePath, course] = await Promise.all([
        imgurUpload(file),
        Course.findByPk(id)
      ])
      if (!course) return errorMsg(res, 404, "Course didn't exist!")
      if (teacherId !== course.teacherId) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')

      const missingField = { categoryId, name, intro, link, duration, startAt }
      if (!emptyObjectValues(missingField)) return errorMsg(res, 400, 'All fields are required and cannot be empty') // 避免使用者改成空值

      const updatedCourse = await course.update({
        categoryId,
        name,
        intro,
        link,
        duration,
        image: filePath || course.image,
        startAt
      })

      updatedCourse.dataValues.startAt = formatCourseDate(updatedCourse.dataValues.startAt)
      const { createdAt, updatedAt, price, ...rest } = updatedCourse.dataValues
      updatedCourse.dataValues = rest

      res.json({ status: 'success', data: updatedCourse })
    } catch (err) {
      next(err)
    }
  }
}
