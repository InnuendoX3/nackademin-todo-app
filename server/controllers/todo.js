const todoModel = require('../models/todo')

// Retrieve all the Todos from database
async function getAllTodos(req, res) {
  await todoModel.findTodos()
    .then( data => {
      res.send(data)
    })
}

// Create a new Todo
async function create(req, res) {
  const todo = {
    title: req.body.title,
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

// Retrieve just one Todo by its id
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

// Delete a Todo by its id
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

// Edit Todo´s title and isDone 
// ? Is it better make a dedicated function for toggle the isDone key ?
async function editTodo(req, res) {
  const id = req.params.id
  const newTodo = {
    title: req.body.title,
    isDone: req.body.isDone
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