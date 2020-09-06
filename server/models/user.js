const { dbUsers } = require("../database/createDB");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

async function findUsers() {
  return await dbUsers.find()
}

async function saveUser(user) {
  const userToSave = {
    username: user.username,
    role: user.role,
    hashedPass: bcrypt.hashSync(user.password, 10)
  }
  return await dbUsers.insert(userToSave)
}

async function findUser(filterQuery) {
  return await dbUsers.findOne(filterQuery)
}

async function removeUser(filterQuery) {
  return await dbUsers.remove(filterQuery)
}

async function updateUser(query, newUserData) {
  const newDataToSave = {
    username: newUserData.username,
    role: newUserData.role,
    hashedPass: bcrypt.hashSync(newUserData.password, 10)
  }
  return await dbUsers.update(query, { $set: newDataToSave }, { returnUpdatedDocs: true })
}


/** Authentication functions */

async function findUserByUsername(username) {
  const query = { username }
  const user = await dbUsers.findOne(query)
  return user
}

async function isPasswordCorrect(pass, hash) {
  return bcrypt.compareSync(pass, hash)
}

async function authenticate(username, password) {
  const user = await findUserByUsername(username)
  if(!user) throw new Error('USERNAME or password incorrect')

  const isPassword = await isPasswordCorrect(password, user.hashedPass)
  if(!isPassword) throw new Error('Username or PASSWORD incorrect')

  // JWT 
  const toEncrypt = {
    userId: user._id,
    role: user.role
  }
  console.log(toEncrypt)
  const token = jwt.sign(toEncrypt, secret, { expiresIn: '1h' })
  console.log(token)
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