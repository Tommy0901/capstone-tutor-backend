const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const courseController = require('../controllers/course-controller')
const registerController = require('../controllers/register-controller')
const admin = require('./modules/admin')

const { apiErrorHandler } = require('../middlewares/error-handler')
const { authenticated, authenticatedAdmin, facebookOauth, facebookOauthRedirect } = require('../middlewares/auth-handler')
const { upload } = require('../middlewares/upload-file-handler')

router.get('/login/facebook', facebookOauth)
router.get('/oauth/redirect/facebook', facebookOauthRedirect)

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

router.get('/home', userController.homepage)

router.use(authenticated)

router.use('/admin', authenticatedAdmin, admin)

router.get('/student/:id/edit', userController.editStudent)
router.put('/student/:id', upload.single('avatar'), userController.putStudent)
router.get('/student/:id', userController.getStudent)

router.get('/teacher/:id/personal', userController.getTeacher)
router.get('/teacher/:id/edit', userController.editTeacher)
router.put('/teacher/:id', upload.single('avatar'), userController.putTeacher)
router.patch('/teacher/:id', userController.patchTeacher)
router.get('/teacher/:id', userController.getTeacher)

router.get('/course/:courseId', courseController.getCourse)
router.put('/course/:courseId', upload.single('image'), courseController.putCourse)
router.post('/course', upload.single('image'), courseController.postCourse)
router.get('/courses', courseController.getCourses)

router.get('/register/all', registerController.getRegistrations)
router.get('/register/:courseId', registerController.getCourseRegisters)
router.post('/register/:courseId', registerController.postRegistration)
router.put('/register/:courseId', registerController.putRegistration)
router.delete('/register/:courseId', registerController.deleteRegistration)

router.use('/', apiErrorHandler)

module.exports = router
