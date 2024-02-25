const passport = require('passport')
const { User, Admin } = require('../models')

const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions,
  async (jwtPayload, done) => {
    try {
      const userData = await User.findByPk(jwtPayload.id, { raw: true })
      if (!userData) {
        const adminData = await Admin.findByPk(jwtPayload.id, { raw: true })
        const { password, ...adminUser } = adminData
        adminUser.isAdmin = true
        return done(null, adminUser)
      }
      const { password, ...teacherUser } = userData

      if (teacherUser.isTeacher) return done(null, teacherUser)
      const { teachStyle, mon, tue, wed, thu, fri, sat, sun, ...studentUser } = teacherUser
      done(null, studentUser)
    } catch (err) {
      done(err)
    }
  }))

module.exports = passport
