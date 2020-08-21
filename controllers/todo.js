const todoModel = require('../models/todo')

async function create(req, res) {
  const todo = {
    title: req.body.todo,
    isDone: false
  }
  const response = await todoModel.saveTodo(todo)
  res.send(response)
}

module.exports = {
  create,
}