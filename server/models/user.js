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

async function findUser(id) {
  const query = { _id: id }
  return await dbUsers.findOne(query)
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

async function login(username, password) {
  const query = { username }
  const user = dbUsers.findOne(query)
  const result = bcrypt.compareSync(password, user.hashedPass)
  return result ? user : false
}


module.exports = {
  findUsers,
  saveUser,
  findUser,
  removeUser,
  updateUser
}