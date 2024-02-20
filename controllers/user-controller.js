const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { errorMsg } = require('../middlewares/message-handler')

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { body: { name, email, password, passwordCheck } } = req
      if (!name || !email || !password) return errorMsg(res, 401, 'Please enter name, email and password!')
      if (password !== passwordCheck) return errorMsg(res, 401, 'Passwords do not match!')

      if (await User.findOne({ where: { email } })) return errorMsg(res, 401, 'Email already exists!')

      const createdUser = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
      const { password: removePassword, ...user } = createdUser.toJSON()
      res.json({ status: 'success', user })
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { body: { email, password: inputPassword } } = req
      if (!email || !inputPassword) return errorMsg(res, 401, 'Please enter email and password!')

      const userData = await User.findOne({ attributes: ['id', 'password'], where: { email }, raw: true })
      if (!userData) return errorMsg(res, 401, 'email 或密碼錯誤')

      const { password, ...user } = userData
      await bcrypt.compare(inputPassword, password)
        ? res.json({
          status: 'success',
          data: {
            token: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' }),
            user
          }
        })
        : errorMsg(res, 401, 'email 或密碼錯誤')
    } catch (err) {
      next(err)
    }
  }
}
