const bcrypt = require('bcryptjs')
const passport = require('passport')

const { User, Admin } = require('../models')

const { throwError } = require('../middlewares/error-handler')

const FacebookStrategy = require('passport-facebook')
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(
  new JwtStrategy(
    jwtOptions,
    async (jwtPayload, done) => {
      try {
        if (!('isTeacher' in jwtPayload)) {
          const adminData = await Admin.findByPk(jwtPayload.id, { raw: true })
          if (!adminData) return throwError(401, 'unauthorized')
          const { password, ...adminUser } = adminData
          adminUser.isAdmin = true
          return done(null, adminUser)
        }
        const userData = await User.findByPk(jwtPayload.id, { raw: true })
        if (!userData) return throwError(401, 'unauthorized')
        const { password, ...teacherUser } = userData

        if (teacherUser.isTeacher) return done(null, teacherUser)
        const { teachStyle, mon, tue, wed, thu, fri, sat, sun, ...studentUser } = teacherUser
        done(null, studentUser)
      } catch (err) {
        done(err)
      }
    }
  )
)

const facebookOptions = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['displayName', 'email']
}

passport.use(
  new FacebookStrategy(
    facebookOptions,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { value: email } = profile.emails[0]
        const { displayName: name } = profile
        const user = await User.findOne({
          attributes: ['id', 'name', 'email'],
          where: { email },
          raw: true
        })
        if (user) {
          done(null, user)
        } else {
          const randomPwd = Math.random().toString(36).slice(-8)
          const { id } = await User.create({
            email,
            name,
            password: await bcrypt.hash(randomPwd, 10)
          })
          return done(null, { id, name, email })
        }
      } catch (err) {
        done(err)
      }
    }
  )
)

module.exports = passport
