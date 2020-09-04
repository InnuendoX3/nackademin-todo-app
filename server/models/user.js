const { dbUsers } = require("../database/createDB");
const bcrypt = require('bcryptjs');

async function findUsers() {
  return await dbUsers.find()
}

async function saveUser(user) {
  const userToSave = {
    username:   user.username,
    role:       user.role,
    hashedPass: bcrypt.hashSync(user.password, 10)
  }
  return await dbUsers.insert(userToSave)
}

async function findUser(filterQuery) {
  return await dbUsers.findOne(filterQuery)
}

async function removeUser(id) {
  const query = { _id: id }
  return await dbUsers.remove(query)
}

async function updateUser(id, newUserData) {
  const query = { _id: id }
  const newDataToSave = {
    username:   newUserData.username,
    role:       newUserData.role,
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



module.exports = {
  findUsers,
  saveUser,
  findUser,
  removeUser,
  updateUser,
  findUserByUsername,
  isPasswordCorrect
}