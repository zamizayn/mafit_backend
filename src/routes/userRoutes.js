const express = require('express')
const router = express.Router()

const auth = require('../middlewares/authMiddleware')
const checkPermission = require('../middlewares/permissionMiddleware')

const userController = require('../controllers/userController')

router.post(
    '/',
    auth,
    checkPermission('manage_users'),
    userController.createUser
)

router.delete(
    '/:id',
    auth,
    checkPermission('manage_users'),
    userController.deleteUser
)

router.get(
    '/me',
    auth,
    userController.getMe
)

router.get('/trainers', userController.getTrainers)
router.post('/trainers', userController.createTrainer)

module.exports = router