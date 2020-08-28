const { dbTodos } = require('../database/createDB')

async function findTodos() {
  return await dbTodos.find()
}

async function saveTodo(todo) {
  return await dbTodos.insert(todo)
}

async function findTodo(id) {
  const query = { _id: id }
  return await dbTodos.findOne(query)
}

async function removeTodo(id) {
  const query = { _id: id }
  return await dbTodos.remove(query)
}

async function updateTodo(id, newTodo) {
  const query = { _id: id }
  return await dbTodos.update(query, { $set: newTodo }, {returnUpdatedDocs: true})
}

module.exports = {
  findTodos,
  saveTodo,
  findTodo,
  removeTodo,
  updateTodo,
}