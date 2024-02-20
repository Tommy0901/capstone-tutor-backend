const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middlewares/error-handler')

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

router.use('/', apiErrorHandler)

module.exports = router
