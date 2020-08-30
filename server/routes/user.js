const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')


router.get('/', userController.getAllUsers)
router.post('/', userController.create)
router.get('/:id', userController.getUser)
router.delete('/:id', userController.deleteUser)
router.patch('/:id', userController.editUser)

//router.post('/login', userController.login)

module.exports = router