const { throwError } = require('../middlewares/error-handler')
const { errorMsg } = require('../middlewares/message-handler')
const { Registration, Course, User } = require('../models')
const { Op } = require('sequelize')
const { currentTaipeiTime } = require('../helpers/time-helpers')

module.exports = {
  getRegistrations: async (req, res, next) => {
    try {
      const { query: { keyword }, user: { id: studentId } } = req

      const registeredCourses = await Registration.findAll({
        attributes: ['studentId', 'courseId', 'rating', 'comment'],
        where: {
          studentId
        },
        include: [{
          model: Course,
          attributes: [
            'name',
            'category',
            'intro',
            'link',
            'image',
            'duration',
            'startAt',
            'teacherId'
          ],
          where: { ...keyword ? { name: { [Op.like]: `%${keyword}%` } } : {} },
          include: [{
            model: User,
            attributes: ['id', 'name']
          }]
        }]
      })

      const registeredData = registeredCourses.map(registerCourse => {
        const courseJSON = registerCourse.toJSON()
        courseJSON.Course.startAt = currentTaipeiTime(courseJSON.Course.startAt)
        courseJSON.Course.User.teacherName = courseJSON.Course.User.name
        delete courseJSON.Course.User.name
        return courseJSON
      })

      const data = { registeredCourses: registeredData }

      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  getCourseRegisters: async (req, res, next) => {
    try {
      const { params: { courseId }, user: { id: teacherId } } = req
      const courseRegisters = await Registration.findAll({
        attributes: ['studentId', 'courseId', 'rating', 'comment'],
        where: { courseId },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email', 'nickname', 'avatar']
          },
          {
            model: Course,
            attributes: ['teacherId']
          }
        ]
      })
      const courseTeacherId = courseRegisters[0].dataValues.Course.teacherId
      if (courseTeacherId !== teacherId) return errorMsg(res, 403, 'Unable to browse this course booking records.')

      const courseRegistersArr = courseRegisters.map(register => {
        const registerJSON = register.toJSON()

        registerJSON.User.studentName = registerJSON.User.name
        delete registerJSON.User.name

        return registerJSON
      })
      res.json({ status: 'success', data: courseRegistersArr })
    } catch (err) {
      next(err)
    }
  },
  postRegistration: async (req, res, next) => {
    try {
      const { params: { courseId }, user: { id: studentId } } = req

      if (!courseId) return errorMsg(res, 404, "Unable to register the course. Because the course didn't exist!")

      const register = await Registration.findOne({
        where: { courseId },
        include: [{
          model: Course,
          attributes: ['id', 'startAt']
        }]
      })
      if (register) return throwError(403, 'Course has been booked!')

      const createdRegister = await Registration.create({ studentId, courseId })

      createdRegister.dataValues.createdAt = currentTaipeiTime(createdRegister.dataValues.createdAt)
      createdRegister.dataValues.updatedAt = currentTaipeiTime(createdRegister.dataValues.updatedAt)

      if (createdRegister) {
        res.json({ status: 'success', data: createdRegister })
      } else {
        errorMsg(res, 403, 'Register failed!')
      }
    } catch (err) {
      next(err)
    }
  },
  putRegistration: async (req, res, next) => {
    try {
      const { params: { courseId }, body: { rating, comment }, user: { id: studentId } } = req

      const register = await Registration.findOne({
        where: { studentId, courseId },
        include: [{
          model: Course,
          attributes: ['startAt']
        }]
      })

      if (!register) return throwError(403, 'Unable to rate and review this course!')

      const updatedRegister = await register.update({
        studentId,
        courseId,
        rating,
        comment
      })
      const now = new Date()
      const openingTime = register.dataValues.Course.dataValues.startAt
      if (currentTaipeiTime(now) < openingTime) return errorMsg(res, 403, 'Unable to rate and review this course!')

      const isRatingAnInteger = Number.isInteger(updatedRegister.dataValues.rating)
      if (!isRatingAnInteger) return errorMsg(res, 403, 'Course rating has been integer!')

      updatedRegister.dataValues.createdAt = currentTaipeiTime(updatedRegister.dataValues.createdAt)
      updatedRegister.dataValues.updatedAt = currentTaipeiTime(updatedRegister.dataValues.updatedAt)
      register.dataValues.Course.dataValues.startAt = currentTaipeiTime(register.dataValues.Course.dataValues.startAt)

      res.json({ status: 'success', data: updatedRegister })
    } catch (err) {
      next(err)
    }
  },
  deleteRegistration: async (req, res, next) => {
    try {
      const { params: { courseId }, user: { id: studentId } } = req
      const register = await Registration.findOne({ where: { studentId, courseId } })

      if (!register) return errorMsg(res, 404, "Registration didn't exist!")

      register.dataValues.createdAt = currentTaipeiTime(register.dataValues.createdAt)
      register.dataValues.updatedAt = currentTaipeiTime(register.dataValues.updatedAt)
      const deletedRegister = await register.destroy()

      res.json({ status: 'success', data: deletedRegister })
    } catch (err) {
      next(err)
    }
  }

}
