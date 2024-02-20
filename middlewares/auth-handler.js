const passport = require('../config/passport')

module.exports = {
  authenticated (req, res, next) {
    passport.authenticate('jwt', { session: false },
      (err, data) => {
        if (err || !data) return res.status(401).json({ status: 'error', message: 'unauthorized' })
        req.user = data
        next()
      }
    )(req, res, next)
  },
  authenticatedAdmin (req, res, next) {
    req.user?.isAdmin
      ? next()
      : res.status(403).json({ status: 'error', message: 'permission denied' })
  }
}
