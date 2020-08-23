const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo')

router.get('/', todoController.getAllTodos)
router.post('/', todoController.create)
router.get('/:id', todoController.getTodo)
router.delete('/:id', todoController.deleteTodo)
router.put('/:id', todoController.editTodo)

module.exports = router