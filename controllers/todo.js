const todoModel = require('../models/todo')

async function getAllTodos(req, res) {
  await todoModel.findAllTodos()
    .then( data => {
      res.send(data)
    })
}

async function create(req, res) {
  const todo = {
    title: req.body.todo,
    isDone: false
  }
  await todoModel.saveTodo(todo)
    .then( data => {
      const response = {
        message: 'Todo created',
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
      const response = todo ? todo : { message: 'Todo-item does not exist' }
      res.send(response).status(200)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}

async function deleteTodo(req, res) {
  const id = req.params.id
  await todoModel.removeTodo(id)
    .then( numDeleted => {
      const response = {
        message: `Number of Todos deleted: ${numDeleted}`
      }
      res.send(response).status(200)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}

async function editTodo(req, res) {
  const id = req.params.id
  const newTodo = {
    title: req.body.todo
  }
  await todoModel.updateTodo(id, newTodo)
    .then( data => {
      const message = data ? 'Todo-item updated' : 'Could not update Todo-item'
      const response = {
        message: message,
        data: data
      }
      res.send(response).status(200)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}

module.exports = {
  getAllTodos,
  create,
  getTodo,
  deleteTodo,
  editTodo,
}