const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

const { apiErrorHandler } = require('../middlewares/error-handler')
const { authenticated, facebookOauth, facebookOauthRedirect } = require('../middlewares/auth-handler')
const { upload } = require('../middlewares/upload-file-handler')

router.get('/login/facebook', facebookOauth)
router.get('/oauth/redirect/facebook', facebookOauthRedirect)

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

router.use(authenticated)

router.get('/student/:id/edit', userController.editStudent)
router.put('/student/:id', upload.single('avatar'), userController.putStudent)
router.get('/student/:id', userController.getStudent)

router.get('/teacher/:id/personal', userController.getTeacher)
router.get('/teacher/:id/edit', userController.editTeacher)
router.put('/teacher/:id', upload.single('avatar'), userController.putTeacher)
router.patch('/teacher/:id', userController.patchTeacher)
router.get('/teacher/:id', userController.getTeacher)

router.use('/', apiErrorHandler)

module.exports = router
