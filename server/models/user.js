const { dbUsers } = require("../database/createDB");
const bcrypt = require('bcryptjs')

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


module.exports = {
  findUsers,
  saveUser
}