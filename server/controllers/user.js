const userModel = require('../models/user')

// Retrieve all the Users from database
async function getAllUsers(req, res) {
  await userModel.findUsers()
    .then( data => {
      res.send(data)
    })
}


// Create a new User
async function create(req, res) {
  const user = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  }
  await userModel.saveUser(user)
    .then( data => {
      const response = {
        message: 'User created',
        data: data
      }
      res.send(response).status(201)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}

// Retrieve just one Todo by its id
/* async function getTodo(req, res) {
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
    title: req.body.todo,
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
} */

module.exports = {
  getAllUsers,
  create,
}