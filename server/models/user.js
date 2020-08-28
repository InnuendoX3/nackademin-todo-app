const { dbUsers } = require("../database/createDB");

async function findUsers() {
  return await dbUsers.find()
}

async function saveUser(user) {
  return await dbUsers.insert(user)

}


module.exports = {
  findUsers,
  saveUser
}