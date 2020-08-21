const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo')

router.post('/', todoController.create)
router.get('/:id', todoController.getTodo)

module.exports = router