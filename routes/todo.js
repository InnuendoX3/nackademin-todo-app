const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo')
const { userAuthorization } = require('../middlewares/authorization')

router.get('/', userAuthorization, todoController.getAllTodos)
router.post('/', userAuthorization, todoController.create)
router.get('/:id', userAuthorization, todoController.getTodo)
router.delete('/:id', userAuthorization, todoController.deleteTodo)
router.patch('/:id', userAuthorization, todoController.editTodo)

module.exports = router