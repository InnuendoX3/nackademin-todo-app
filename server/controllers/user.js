const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

// Retrieve all the Users from database
async function getAllUsers(req, res) {
  await userModel.findUsers()
    .then( data => {
      res.status(200).send(data)
    })
}

// Create a new User
async function createUser(req, res) {
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
      res.status(201).send(response)
    })
    .catch( error => {
      res.status(400).send(error)
    })
}

// Retrieve a User by its id
async function getUser(req, res) {
  const id = req.params.id
  await userModel.findUser(id)
    .then( user => {
      const response = user ? user : { message: 'That user does not exist' }
      res.status(200).send(response)
    })
    .catch( error => {
      res.status(400).send(error)
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
      res.status(200).send(response)
    })
    .catch( error => {
      res.status(400).send(error)
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
      res.status(200).send(response)
    })
    .catch( error => {
      res.send(error).status(400)
    })
}


/** Authentication functions */

async function login(req, res) {
  const username = req.body.username
  const password = req.body.password

  const user = await userModel.findUserByUsername(username)
  if(!user) return res.status(400).send({message: 'USERNAME or password incorrect'})

  const isPassword = await userModel.isPasswordCorrect(password, user.hashedPass)
  if(!isPassword) return res.status(400).send({message: 'Username or PASSWORD incorrect'})

  // JWT 
  const toEncrypt = {
    userId: user._id,
    role: user.role
  }
  const token = { token: jwt.sign(toEncrypt, secret) }
  console.log(token)
  res.status(200).send(token)
}


module.exports = {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  editUser,
  login
}