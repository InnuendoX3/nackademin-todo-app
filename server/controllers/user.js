const userModel = require('../models/user')


// Retrieve all the Users from database
// Admin
async function getAllUsers(req, res) {
  await userModel.findUsers()
    .then( data => {
      res.status(200).send(data)
    })
}

// Create a new User
// Admin
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
// Admin can get anyone's user doc
// User just get his own
async function getUser(req, res) {
  const idToFind = req.params.id
  const userId = req.user.userId
  const role = req.user.role
  const queryFilter = { _id: idToFind }

  if(role !== 'admin' && idToFind !== userId) return res.sendStatus(401)

  await userModel.findUser(queryFilter)
    .then( user => {
      const response = user ? user : { message: 'That user does not exist' }
      res.status(200).send(response)
    })
    .catch( error => {
      res.status(400).send(error)
    })
}

// Delete a User by its id
// Admin can delete all user
// User just himself
async function deleteUser(req, res) {
  const idToDelete = req.params.id
  const idUser = req.user.userId
  const role = req.user.role
  const queryFilter = { _id: idToDelete}

  if(role !== 'admin' && idToDelete !== idUser) return res.sendStatus(401)

  await userModel.removeUser(queryFilter)
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
// Admin can edit all users
// User just himself
async function editUser(req, res) {
  const idUserToEdit = req.params.id
  const newUserData = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  }
  const queryFilter = { _id: idUserToEdit}
  
  // Loged-User Info
  const userId = req.user.userId
  const role = req.user.role
  
  if(role !== 'admin' && idUserToEdit !== userId) return res.sendStatus(401)
  
  await userModel.updateUser(queryFilter, newUserData)
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


// Authentication
// Takes username and password
// Returns JWT signed Token
async function login(req, res) {
  const username = req.body.username
  const password = req.body.password

  try {
    const token = await userModel.authenticate(username, password)
    res.status(200).send({ token })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error.toString() })
  }
}


module.exports = {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  editUser,
  login
}