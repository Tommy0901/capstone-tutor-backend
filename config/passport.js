const passport = require('passport')
const { User } = require('../models')

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
      const { password, ...teacherUser } = userData

      if (teacherUser.isTeacher) return done(null, teacherUser)
      const { mon, tue, wed, thu, fri, sat, sun, teachStyle, ...studentUser } = teacherUser
      done(null, studentUser)
    } catch (err) {
      done(err)
    }
  }))

module.exports = passport
