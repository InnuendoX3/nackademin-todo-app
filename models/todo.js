const db = require('../database/createDB.js')

async function saveTodo(todo) {
  return await db.insert(todo)
}

async function findTodo(id) {
  const query = {
    _id: id
  }
  return await db.findOne(query)
}

module.exports = {
  saveTodo,
  findTodo
}