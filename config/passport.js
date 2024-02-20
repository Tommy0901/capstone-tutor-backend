const passport = require('passport')
const { User } = require('../models')

const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions,
  (jwtPayload, done) => {
    const { id } = jwtPayload;
    (async () => {
      try {
        const userData = await User.findByPk(id)
        const { password, ...user } = userData.toJSON()
        done(null, user)
      } catch (err) {
        done(err)
      }
    })()
  }))

module.exports = passport
