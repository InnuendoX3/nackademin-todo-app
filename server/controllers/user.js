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

// Retrieve a User by its id
async function getUser(req, res) {
  const id = req.params.id
  await userModel.findUser(id)
    .then( user => {
      const response = user ? user : { message: 'That user does not exist' }
      res.send(response).status(200)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}

// Delete a User by its id
async function deleteUser(req, res) {
  const id = req.params.id
  await userModel.removeUser(id)
    .then( numDeleted => {
      const response = {
        message: `Number of user deleted: ${numDeleted}`
      }
      res.send(response).status(200)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}

// Edit User: name, password and role
async function editUser(req, res) {
  const id = req.params.id
  const newUserData = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  }
  await userModel.updateUser(id, newUserData)
    .then( data => {
      const message = data ? 'User updated' : 'Could not update User'
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
  getAllUsers,
  create,
  getUser,
  deleteUser,
  editUser
}