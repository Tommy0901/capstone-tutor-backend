const dayjs = require('dayjs')
const { Course, User, Registration, Category } = require('../models')
const { errorMsg } = require('../middlewares/message-handler')
const { imgurUpload } = require('../helpers/image-helpers')
const { emptyObjectValues } = require('../helpers/datatype-helpers')
const { currentTaipeiTime, formatCourseDate } = require('../helpers/time-helpers')

module.exports = {
  postCourse: async (req, res, next) => {
    try {
      const { user: { id, isTeacher } } = req
      const { body: { category, name, intro, link, duration, startAt }, file } = req

      if (!isTeacher) return errorMsg(res, 403, 'Insufficient permission. Unable to create a new course!')

      const missingField = { category, name, intro, link, duration, startAt }
      if (!emptyObjectValues(missingField)) return errorMsg(res, 400, 'All fields are required') // 找出沒有填寫的欄位

      let [categoryArr, weekDays] = await Promise.all([
        Category.findAll({ raw: true }),
        User.findByPk(id, { attributes: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], raw: true })
      ])
      const categoryIdArr = categoryArr.map(category => category.id)
      if (!category.every(i => categoryIdArr.includes(i))) return errorMsg(res, 400, 'Please input correct category!')

      const hasDuplicate = category.filter((value, index, self) => self.indexOf(value) !== index).length > 0
      if (hasDuplicate) return errorMsg(res, 403, 'Course category is repeated. Please input correct category!')

      if (duration !== 30 && duration !== 60) return errorMsg(res, 400, 'Course duration time has been 30 min or 60 min!')

      const now = new Date()
      if (startAt <= currentTaipeiTime(now)) return errorMsg(res, 400, 'Course opening time should not be before today!')

      const weekDayArr = Object.values(weekDays).map(day => day === 1)
      const courseDay = dayjs(startAt).day()
      if (!weekDayArr[courseDay]) return errorMsg(res, 400, "Class schedule conflicts with teacher's availability")

      const filePath = await imgurUpload(file) || ''

      categoryArr = categoryArr.filter(item => category.includes(item.id))
      const categoryName = categoryArr.map(category => category.name)

      const createdCourse = await Course.create({
        teacherId: id,
        category: categoryName,
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
        attributes: ['id', 'teacherId', 'category', 'name', 'intro', 'link', 'duration', 'image', 'startAt'],
        include: [{
          model: Registration,
          attributes: ['id', 'studentId', 'courseId', 'rating', 'comment'],
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
      const { body: { category, name, intro, link, duration, startAt }, file } = req

      let [categoryArr, weekDays] = await Promise.all([
        Category.findAll({ raw: true }),
        User.findByPk(teacherId, { attributes: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], raw: true })
      ])
      const categoryIdArr = categoryArr.map(category => category.id)
      if (!category.every(i => categoryIdArr.includes(i))) return errorMsg(res, 400, 'Please input correct category!')

      const hasDuplicate = category.filter((value, index, self) => self.indexOf(value) !== index).length > 0
      if (hasDuplicate) return errorMsg(res, 400, 'Course category is repeated. Please input correct category!')

      if (duration !== 30 && duration !== 60) return errorMsg(res, 400, 'Course duration time has been 30 min or 60 min!')

      const now = new Date()
      if (startAt <= currentTaipeiTime(now)) return errorMsg(res, 400, 'Course opening time should not be before today!')

      const weekDayArr = Object.values(weekDays).map(day => day === 1)
      const courseDay = dayjs(startAt).day()
      if (!weekDayArr[courseDay]) return errorMsg(res, 400, "Class schedule conflicts with teacher's availability")

      const [filePath, course] = await Promise.all([
        imgurUpload(file),
        Course.findByPk(id)
      ])
      if (!course) return errorMsg(res, 404, "Course didn't exist!")
      if (teacherId !== course.teacherId) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')

      const missingField = { category, name, intro, link, duration, startAt }
      if (!emptyObjectValues(missingField)) return errorMsg(res, 400, 'All fields are required and cannot be empty') // 避免使用者改成空值

      categoryArr = categoryArr.filter(item => category.includes(item.id))
      const categoryName = categoryArr.map(category => category.name)

      const updatedCourse = await course.update({
        category: categoryName,
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
