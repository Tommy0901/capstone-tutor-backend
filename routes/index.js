const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const courseController = require('../controllers/course-controller')
const admin = require('./modules/admin')

const { apiErrorHandler } = require('../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../middlewares/auth-handler')
const { upload } = require('../middlewares/upload-file-handler')

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

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
router.post('/course/:teacherId', courseController.postCourse)
router.put('/course/:courseId', courseController.putCourse)
router.get('/courses', courseController.getCourses)

router.use('/', apiErrorHandler)

module.exports = router
