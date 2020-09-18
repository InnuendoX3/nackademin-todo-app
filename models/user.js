const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  hashedPass: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

const UserModel = mongoose.model('User', userSchema)


/** UserModel functions **/

async function findUsers() {
  return await UserModel.find()
}

async function saveUser(user) {
  const userToSave = {
    username: user.username,
    role: user.role,
    hashedPass: bcrypt.hashSync(user.password, 10)
  }
  const newUser = new UserModel(userToSave)
  //console.log('newUser', newUser)
  const tempResponse = await newUser.save()
  //console.log('tempResponse', tempResponse)
  return tempResponse
}

async function findUser(filterQuery) {
  return await UserModel.findOne(filterQuery)
}

async function removeUser(filterQuery) {
  const response = await UserModel.deleteOne(filterQuery)
  return response.deletedCount
}

// TODO: Do not return hashed pass
async function updateUser(query, newUserData) {
  const newDataToSave = {
    username: newUserData.username,
    role: newUserData.role,
    hashedPass: bcrypt.hashSync(newUserData.password, 10)
  }
  const response = await UserModel.findOneAndUpdate(query, newDataToSave, { new: true })
  return response
}


/** Authentication functions */

async function findUserByUsername(username) {
  const query = { username }
  const user = await UserModel.findOne(query)
  return user
}

async function isPasswordCorrect(pass, hash) {
  return bcrypt.compareSync(pass, hash)
}

async function authenticate(username, password) {
  const user = await findUserByUsername(username)
  if(!user) {
    // Tests sometimes goes wrong here
    console.log('!user on authentication', user)
    throw new Error('USERNAME or password incorrect')
  }

  const isPassword = await isPasswordCorrect(password, user.hashedPass)
  if(!isPassword) throw new Error('Username or PASSWORD incorrect')

  // JWT 
  const toEncrypt = {
    userId: user._id,
    role: user.role
  }
  const token = jwt.sign(toEncrypt, secret, { expiresIn: '1h' })
  return token
}



module.exports = {
  findUsers,
  saveUser,
  findUser,
  removeUser,
  updateUser,
  findUserByUsername,
  isPasswordCorrect,
  authenticate
}