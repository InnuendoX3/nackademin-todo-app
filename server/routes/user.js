const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { adminAuthorization } = require('../middlewares/authorization')


router.get('/', adminAuthorization, userController.getAllUsers)
router.post('/', adminAuthorization, userController.createUser)
router.get('/:id', adminAuthorization, userController.getUser)
router.delete('/:id', adminAuthorization, userController.deleteUser)
router.patch('/:id', adminAuthorization, userController.editUser)

module.exports = router