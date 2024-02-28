const { throwError } = require('../middlewares/error-handler')
const { errorMsg } = require('../middlewares/message-handler')
const { Registration, Course, User } = require('../models')
const { Op } = require('sequelize')
const { currentTaipeiTime } = require('../helpers/time-helpers')

module.exports = {
  getRegistrations: async (req, res, next) => {
    try {
      const { query: { keyword }, user: { id: studentId } } = req
      const likeKeyword = { [Op.like]: `%${keyword}%` }
      const [teacherName, courseName] = Array.from({ length: 2 }, () => likeKeyword)
      const searchFields = { teacherName, courseName }

      const [registeredCourses, user] = await Promise.all([
        Registration.findAll({
          attributes: ['studentId', 'courseId', 'rating', 'comment'],
          where: { studentId },
          include: [{
            model: Course,
            attributes: [
              'name',
              'category',
              'link',
              'image',
              'duration',
              'startAt',
              'teacherId'
            ],
            where: { ...keyword ? searchFields.courseName : {} },
            include: [{
              model: User,
              attributes: ['id', 'name'],
              where: {
                ...keyword ? searchFields.teacherName : {}
              }
            }]
          }]
        }),
        User.findByPk(studentId, {
          attributes: [
            'id',
            'name',
            'nickname',
            'avatar',
            'totalStudy',
            'selfIntro',
            'isTeacher'
          ],
          raw: true
        })
      ])
      if (!user || user.isTeacher) return errorMsg(res, 404, 'Permission denied. Unable to browse your registered courses!')
      if (registeredCourses.length === 0) return throwError(404, "You haven't registered for any courses yet!")

      const registeredData = registeredCourses.map(registerCourse => {
        const courseJSON = registerCourse.toJSON()
        courseJSON.Course.startAt = currentTaipeiTime(courseJSON.Course.startAt)
        courseJSON.Course.teacher = courseJSON.Course.User
        delete courseJSON.Course.User
        return courseJSON
      })

      const data = { registeredCourses: registeredData, user }

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
            attributes: ['id', 'name', 'email']
          },
          {
            model: Course,
            attributes: ['teacherId'],
            include: [
              {
                model: User,
                attributes: ['id', 'isTeacher']
              }
            ]
          }
        ]
      })
      const courseRegistersArr = courseRegisters.map(register => {
        const registerJSON = register.toJSON()

        registerJSON.student = registerJSON.User
        delete registerJSON.User
        registerJSON.Course.teacher = registerJSON.Course.User
        delete registerJSON.Course.User

        return registerJSON
      })
      const courseTeacherId = courseRegistersArr[0].Course.teacherId
      const isTeacher = courseRegistersArr[0].Course.teacher.isTeacher

      if (courseTeacherId !== teacherId || !teacherId || !isTeacher) return errorMsg(res, 403, 'Unable to browse this course booking records.')
      res.json({ status: 'success', data: courseRegistersArr })
    } catch (err) {
      next(err)
    }
  },
  postRegistration: async (req, res, next) => {
    try {
      const { params: { courseId }, body: { category, startAt }, user: { id: studentId } } = req
      const [user, register] = await Promise.all([
        User.findByPk(studentId, { attributes: ['id', 'name', 'isTeacher'] }),
        Registration.findOne({ where: { studentId, courseId } })
      ])
      if (user.dataValues.isTeacher) return throwError(403, 'Permission denied! Unable to register the course.')
      if (register) return throwError(403, 'Course has been booked!')

      const [createdRegister, course] = await Promise.all([
        Registration.create({ studentId, courseId }),
        Course.findByPk(courseId, {
          attributes: ['teacherId', 'category', 'startAt', 'duration'],
          include: [{
            model: User,
            attributes: ['name', 'nickname']
          }]
        })
      ])

      if (!(course.category.includes(category))) return throwError(404, "Course hasn't this category!")
      if (startAt !== currentTaipeiTime(course.dataValues.startAt)) return throwError(404, 'This is not the course opening time!')
      createdRegister.dataValues.createdAt = currentTaipeiTime(createdRegister.dataValues.createdAt)
      createdRegister.dataValues.updatedAt = currentTaipeiTime(createdRegister.dataValues.updatedAt)
      course.dataValues.startAt = currentTaipeiTime(course.dataValues.startAt)

      const { User: teacher, ...courseData } = course.toJSON()
      courseData.teacher = teacher
      const data = { student: user, register: createdRegister.dataValues, courseData }

      if (createdRegister) {
        await user.increment('totalStudy', { by: `${course.duration}` })
        res.json({ status: 'success', data })
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
      const [register, user] = await Promise.all([
        Registration.findOne({ where: { studentId, courseId } }),
        User.findByPk(studentId)
      ])
      if (!user || user.isTeacher) return throwError(403, 'Unable to rate and review this course!')
      if (!register) return throwError(403, "You haven't registered the course!")

      const updatedRegister = await register.update({
        studentId,
        courseId,
        rating,
        comment
      })
      updatedRegister.dataValues.createdAt = currentTaipeiTime(updatedRegister.dataValues.createdAt)
      updatedRegister.dataValues.updatedAt = currentTaipeiTime(updatedRegister.dataValues.updatedAt)
      res.json({ status: 'success', data: updatedRegister })
    } catch (err) {
      next(err)
    }
  },
  deleteRegistration: async (req, res, next) => {
    try {
      const { params: { courseId }, user: { id: studentId } } = req
      const [user, register] = await Promise.all([
        User.findByPk(studentId, { attributes: ['isTeacher'], raw: true }),
        Registration.findOne({ where: { studentId, courseId } })
      ])

      if (user.isTeacher) return errorMsg(res, 403, 'Unable to cancel the register.')
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
