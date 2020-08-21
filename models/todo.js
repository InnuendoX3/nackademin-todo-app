const db = require('../database/createDB.js')

async function findAllTodos() {
  return await db.find()
}

async function saveTodo(todo) {
  return await db.insert(todo)
}

async function findTodo(id) {
  const query = {
    _id: id
  }
  return await db.findOne(query)
}

async function removeTodo(id) {
  const query = {
    _id: id
  }
  return await db.remove(query)
}

async function updateTodo(id, newTodo) {
  const query = {
    _id: id
  }
  return await db.update(query, { $set: newTodo }, {returnUpdatedDocs: true})
}

module.exports = {
  findAllTodos,
  saveTodo,
  findTodo,
  removeTodo,
  updateTodo,
}