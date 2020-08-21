const todoModel = require('../models/todo')

async function create(req, res) {
  const todo = {
    title: req.body.todo,
    isDone: false
  }
  await todoModel.saveTodo(todo)
    .then( data => {
      const response = {
        message: 'ToDo created',
        data: data
      }
      res.send(response).status(201)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}

async function getTodo(req, res) {
  const id = req.params.id
  await todoModel.findTodo(id)
    .then( todo => {
      const response = todo ? todo : { message: 'Todo-item does not exist'}
      res.send(response)
    })
    .catch( error => {
      res.send(error)
    })
}

module.exports = {
  create,
  getTodo,
}