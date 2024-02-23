const passport = require('../config/passport')
const jwt = require('jsonwebtoken')

module.exports = {
  authenticated (req, res, next) {
    passport.authenticate('jwt',
      (err, data) => {
        if (err || (!data && data !== false)) {
          return err
            ? res.status(500).json({ status: 'error', message: err.message })
            : res.status(401).json({ status: 'error', message: 'unauthorized' })
        }
        req.user = data
        next()
      }
    )(req, res, next)
  },
  authenticatedAdmin (req, res, next) {
    req.user?.isAdmin
      ? next()
      : res.status(403).json({ status: 'error', message: 'permission denied' })
  },
  facebookOauth (req, res, next) {
    next(passport.authenticate('facebook', { scope: ['email'] })(req, res))
  },
  facebookOauthRedirect (req, res, next) {
    passport.authenticate('facebook',
      (err, data) => {
        if (err || !data) {
          return err
            ? res.status(500).json({ status: 'error', message: err.message })
            : res.status(401).json({ status: 'error', message: 'Authentication failed' })
        }
        data.token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.json({ status: 'success', data })
      }
    )(req, res)
  }
}
