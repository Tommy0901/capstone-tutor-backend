const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

const { apiErrorHandler } = require('../middlewares/error-handler')
const { authenticated } = require('../middlewares/auth-handler')
const { upload } = require('../middlewares/upload-file-handler')

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

router.use(authenticated)

router.get('/student/:id/edit', userController.editStudent)
router.put('/student/:id', upload.single('avatar'), userController.putStudent)
router.get('/student/:id', userController.getStudent)

router.use('/', apiErrorHandler)

module.exports = router
