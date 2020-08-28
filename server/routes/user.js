const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')


router.get('/', userController.getAllUsers)
router.post('/', userController.create)
/* router.get('/:id')
router.delete('/:id')
router.patch('/:id') */

module.exports = router