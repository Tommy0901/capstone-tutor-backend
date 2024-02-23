const { User } = require('../models')

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'isTeacher'],
        raw: true
      })
      res.json({ status: 'success', data: users })
    } catch (err) {
      next(err)
    }
  }
}
