const { Course, User, Category } = require('../models')
const { Op } = require('sequelize')
const { errorMsg } = require('../middlewares/message-handler')
const { imgurUpload } = require('../helpers/image-helpers')
const { getOffset } = require('../helpers/pagination-helper')
const placeholderImg = 'https://fakeimg.pl/300/?text=course%20img'

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
      const { params: { teacherId: id }, user: { id: teacherId } } = req
      const { body: { categoryId, name, intro, link, duration, startAt }, file } = req
      if (+id !== teacherId) return errorMsg(res, 401, "Insufficient permission. Don't create the new course!")

      const filePath = await imgurUpload(file) || placeholderImg
      const missingField = Object.values(req.body).some(item => !item) // 找出沒有填寫的欄位
      if (missingField) return errorMsg(res, 400, 'All fields are required')

      const createdCourse = await Course.create({
        teacherId,
        categoryId,
        name,
        intro,
        link,
        duration,
        image: filePath,
        startAt
      })
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
        raw: true
      })
      if (!course) return errorMsg(res, 404, "Course didn't exist!")
      res.json({ status: 'success', data: course })
    } catch (err) {
      next(err)
    }
  },
  putCourse: async (req, res, next) => {
    try {
      const { params: { courseId: id }, user: { id: teacherId } } = req
      const { body: { categoryId, name, intro, link, duration, startAt }, file } = req

      const [filePath, user, course] = await Promise.all([
        imgurUpload(file),
        User.findByPk(teacherId, { raw: true }),
        Course.findByPk(id)
      ])
      if (!user.isTeacher) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')
      if (!course) return errorMsg(res, 404, "Course didn't exist!")

      const updatedCourse = await course.update({
        categoryId,
        name,
        intro,
        link,
        duration,
        image: filePath || course.image,
        startAt
      })
      res.json({ status: 'success', data: updatedCourse })
    } catch (err) {
      next(err)
    }
  }
}
