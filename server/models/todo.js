const { dbTodos } = require('../database/createDB')

async function findTodos(filter) {
  return await dbTodos.find(filter)
}

async function saveTodo(todo) {
  return await dbTodos.insert(todo)
}

async function findTodo(filter) {
  const todo = await dbTodos.findOne(filter)
  if(!todo) return null
  const response = {
    ...todo,
    isOwner(userId) {
      return userId === this.ownerId
    }
  }
  return response
}

async function removeTodo(filter) {
  return await dbTodos.remove(filter, { multi: true })
}

async function updateTodo(filter, newTodo) {
  return await dbTodos.update(filter, { $set: newTodo }, { returnUpdatedDocs: true })
}

module.exports = {
  findTodos,
  saveTodo,
  findTodo,
  removeTodo,
  updateTodo,
}