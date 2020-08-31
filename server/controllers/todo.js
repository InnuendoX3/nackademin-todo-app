const todoModel = require('../models/todo')


//  Get all Todos
//  Admin get everybody's todos
//  User get only the todos that own   
async function getAllTodos(req, res) {
  const filter = req.user.role === 'admin'
    ? {}
    : { ownerId: req.user.userId }
  await todoModel.findTodos(filter)
    .then( data => {
      res.status(200).send(data)
    })
}

// Create a new Todo
async function create(req, res) {
  const todo = {
    title: req.body.title,
    isDone: false,
    ownerId: req.user.userId
  }
  await todoModel.saveTodo(todo)
    .then( data => {
      const response = {
        message: 'Todo created',
        data: data
      }
      res.status(201).send(response)
    })
    .catch( error => {
      res.status(400).send(error)
    })
}

// Retrieve just one Todo by its id
// Admin can access all todos
// User can access just his own
async function getTodo(req, res) {
  const todoId = req.params.id
  const userId = req.user.userId
  const role = req.user.role

  await todoModel.findTodo(todoId)
    .then( todo => {
      if(!todo) return res.sendStatus(400) 
      if(role === 'admin') return res.status(200).send(todo)
      if(!todo.isOwner(userId)) return res.sendStatus(401)
      res.status(200).send(todo)
    })
    .catch( error => {
      console.log(error)
      res.status(400).send(error)
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
      res.status(200).send(response)
    })
    .catch( error => {
      res.status(400).send(error)
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
      res.status(200).send(response)
    })
    .catch( error => {
      res.status(400).send(error)
    })
}

module.exports = {
  getAllTodos,
  create,
  getTodo,
  deleteTodo,
  editTodo,
}