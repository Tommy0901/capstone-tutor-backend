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
            attributes: ['name', 'category', 'link', 'teacherId', 'startAt', 'duration']
          }
        ]
      })

      if (!courseRegisters[0]) return errorMsg(res, 400, "Course didn't exist!")
      const courseTeacherId = courseRegisters[0].dataValues.Course.teacherId
      if (courseTeacherId !== teacherId) return errorMsg(res, 403, 'Unable to browse this course booking records.')

      const courseRegistersArr = courseRegisters.map(register => {
        const registerJSON = register.toJSON()
        registerJSON.Course.startAt = currentTaipeiTime(registerJSON.Course.startAt)
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

      const course = await Course.findByPk(courseId, { raw: true })
      if (!course) return errorMsg(res, 404, "Unable to register the course. Because the course didn't exist!")
      if (studentId === course.teacherId) {
        return errorMsg(res, 403, 'The teacher cannot register for their own course.')
      }

      const now = new Date()
      const openingTime = currentTaipeiTime(course.dataValues.startAt)
      if (currentTaipeiTime(now) > openingTime) return errorMsg(res, 400, 'The course opening time has ended!')

      const register = await Registration.findOne({
        where: { studentId, courseId },
        include: [{
          model: Course,
          attributes: ['id', 'startAt']
        }]
      })
      if (register) return errorMsg(res, 400, 'Duplicate registration for this course')

      const createdRegister = await Registration.create({ studentId, courseId: +courseId })

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

      const isRatingAnInteger = Number.isInteger(rating)
      if (!isRatingAnInteger) return errorMsg(res, 400, 'Course rating has been integer!')

      const register = await Registration.findOne({
        where: { studentId, courseId },
        include: [{
          model: Course,
          attributes: ['startAt']
        }]
      })

      if (!register) return errorMsg(res, 400, 'You have not registered for the course!')

      const now = new Date()
      const openingTime = register.dataValues.Course.dataValues.startAt
      if (currentTaipeiTime(now) <= currentTaipeiTime(openingTime)) return errorMsg(res, 400, 'The course has not started yet!')

      const updatedRegister = await register.update({
        studentId,
        courseId,
        rating,
        comment
      })

      const modifiedRegister = {
        id: updatedRegister.dataValues.id,
        courseId: +courseId,
        studentId,
        rating: updatedRegister.dataValues.rating,
        comment: updatedRegister.dataValues.comment,
        createdAt: currentTaipeiTime(updatedRegister.dataValues.createdAt),
        updatedAt: currentTaipeiTime(updatedRegister.dataValues.updatedAt),
        Course: {
          startAt: updatedRegister.dataValues.Course.dataValues.startAt
        }
      }

      updatedRegister.dataValues.createdAt = currentTaipeiTime(updatedRegister.dataValues.createdAt)
      updatedRegister.dataValues.updatedAt = currentTaipeiTime(updatedRegister.dataValues.updatedAt)
      modifiedRegister.Course.startAt = currentTaipeiTime(modifiedRegister.Course.startAt)

      res.json({ status: 'success', data: modifiedRegister })
    } catch (err) {
      next(err)
    }
  },
  deleteRegistration: async (req, res, next) => {
    try {
      const { params: { courseId }, user: { id: studentId } } = req
      const register = await Registration.findOne({ where: { studentId, courseId } })

      if (!register) return errorMsg(res, 404, "Registration didn't exist!")

      const deletedRegister = await register.destroy()
      const deletedRegisterJSON = deletedRegister.toJSON()

      const modifiedRegister = {
        id: deletedRegisterJSON.id,
        courseId: +courseId,
        studentId,
        rating: deletedRegisterJSON.rating,
        comment: deletedRegisterJSON.comment,
        createdAt: currentTaipeiTime(deletedRegisterJSON.createdAt),
        updatedAt: currentTaipeiTime(deletedRegisterJSON.updatedAt)
      }

      res.json({ status: 'success', data: modifiedRegister })
    } catch (err) {
      next(err)
    }
  }

}
