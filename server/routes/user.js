const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { adminAuthorization, userAuthorization } = require('../middlewares/authorization')

// Admin
router.get('/', adminAuthorization, userController.getAllUsers)
router.post('/', adminAuthorization, userController.createUser)

// User
router.get('/:id', userAuthorization, userController.getUser)
router.delete('/:id', userAuthorization, userController.deleteUser)
router.patch('/:id', userAuthorization, userController.editUser)

module.exports = router