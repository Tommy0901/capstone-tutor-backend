const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { errorMsg } = require('../middlewares/message-handler')
const { imgurUpload } = require('../helpers/image-helpers')
const { booleanObjects } = require('../helpers/datatype-helpers')

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { body: { name, email, password, passwordCheck } } = req
      if (!name || !email || !password) return errorMsg(res, 401, 'Please enter name, email and password!')
      if (password !== passwordCheck) return errorMsg(res, 401, 'Passwords do not match!')

      if (await User.findOne({ where: { email } })) return errorMsg(res, 401, 'Email already exists!')

      const createdUser = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
      const { password: removePassword, ...user } = createdUser.toJSON()
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { body: { password, email } } = req
      if (!password || !email) return errorMsg(res, 401, 'Please enter email and password!')

      const user = await User.findOne({ attributes: ['id', 'password'], where: { email }, raw: true })
      if (!user) return errorMsg(res, 401, 'email 或密碼錯誤')

      await bcrypt.compare(password, user.password)
        ? res.json({
          status: 'success',
          data: {
            id: user.id,
            email,
            token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })
          }
        })
        : errorMsg(res, 401, 'email 或密碼錯誤')
    } catch (err) {
      next(err)
    }
  },
  getStudent: async (req, res, next) => {
    try {
      const { params: { id } } = req
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'nickname', 'avatar', 'selfIntro']
        // include: Registration
      })
      if (!user) return errorMsg(res, 404, "Student didn't exist!")
      res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  editStudent: async (req, res, next) => {
    try {
      const { params: { id }, user: { id: userId } } = req
      if (+id !== userId) return errorMsg(res, 403, 'Permission denied!')
      res.json({
        status: 'success',
        data: await User.findByPk(id, { attributes: ['id', 'name', 'email', 'nickname', 'avatar', 'selfIntro'] })
      })
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
        User.findByPk(id, { attributes: ['id', 'name', 'email', 'nickname', 'avatar', 'selfIntro'] })
      ])
      await user.update({ name, nickname, avatar: filePath || user.avatar, selfIntro })
      res.json({ status: 'success', data: user.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  patchTeacher: async (req, res, next) => {
    try {
      const { params: { id }, user: { id: userId } } = req
      if (+id !== userId) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')
      await User.update({ isTeacher: true }, { where: { id } })
      res.json({
        status: 'success',
        data: await User.findByPk(id, { attributes: ['id', 'name', 'email', 'isTeacher'] })
      })
    } catch (err) {
      next(err)
    }
  },
  getTeacher: async (req, res, next) => {
    try {
      const { params: { id } } = req
      const user = await User.findOne({
        where: { id, isTeacher: true }
        // include: Course
      })
      if (!user) return errorMsg(res, 404, "Teacher didn't exist!")
      const { password, totalStudy, isTeacher, createdAt, updatedAt, ...data } = user.toJSON()
      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  editTeacher: async (req, res, next) => {
    try {
      const { params: { id }, user: { id: userId } } = req
      if (+id !== userId) return errorMsg(res, 403, 'Permission denied!')
      const user = await User.findByPk(id)
      const { password, totalStudy, isTeacher, createdAt, updatedAt, ...data } = user.toJSON()
      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  putTeacher: async (req, res, next) => {
    try {
      const { body: { name, nickname, teachStyle, selfIntro } } = req
      const { body: { mon, tue, wed, thu, fri, sat, sun } } = req
      const whichDay = { mon, tue, wed, thu, fri, sat, sun }

      const { params: { id }, user: { id: userId }, file } = req

      if (+id !== userId) return errorMsg(res, 403, 'Insufficient permissions. Update failed!')
      if (!name) return errorMsg(res, 401, 'Please enter name.')

      if (!booleanObjects(whichDay)) return errorMsg(res, 401, 'Which day input was invalid .')

      const [filePath, user] = await Promise.all([imgurUpload(file), User.findByPk(id)])
      const updateDate = { name, nickname, teachStyle, selfIntro, ...whichDay }

      await user.update({ avatar: filePath || user.avatar, ...updateDate })

      const { password, totalStudy, isTeacher, createdAt, updatedAt, ...data } = user.toJSON()
      res.json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  }
}
