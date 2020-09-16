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
    ownerId: req.user.userId,
    listeOn: req.user.listeOn //new
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

// Get just one Todo by its id
// Admin can access all todos
// User can access just his own
async function getTodo(req, res) {
  const todoId = req.params.id
  const userId = req.user.userId
  const role = req.user.role
  const filter = { _id: todoId}

  await todoModel.findTodo(filter)
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
// Admin can delete everyone´s todos
// User can delete just his own todos
async function deleteTodo(req, res) {
  const todoId = req.params.id
  const userId = req.user.userId
  const role = req.user.role
  let filterQuery = {}

  if(role === 'admin') {
    filterQuery = {_id: todoId}
  }
  if(role === 'user') {
    filterQuery = {
      _id: todoId,
      ownerId: userId
    }
  }

  await todoModel.removeTodo(filterQuery)
    .then( numDeleted => {
      if(numDeleted === 0) 
        return res.status(401).send({message: 'Unauthorized or item does not exist'})
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
// Admin can edit everyone´s todos
// User can edit just his own todos
async function editTodo(req, res) {
  const id = req.params.id
  const userId = req.user.userId
  const role = req.user.role
  const newTodo = {
    title: req.body.title,
    isDone: req.body.isDone
  }
  let filterQuery = {}

  if(role === 'admin') {
    filterQuery = { _id: id }
  }
  if(role === 'user') {
    filterQuery = {
      _id: id,
      ownerId: userId
    }
  }

  await todoModel.updateTodo(filterQuery, newTodo)
    .then( data => {
      if(!data) return res.status(401).send({message: 'Unauthorized or item does not exist'})
      const response = {
        message: 'Todo-item updated',
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