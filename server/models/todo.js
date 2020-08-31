const { dbTodos } = require('../database/createDB')

async function findTodos(filter) {
  return await dbTodos.find(filter)
}

async function saveTodo(todo) {
  return await dbTodos.insert(todo)
}

async function findTodo(id) {
  const query = { _id: id }
  const todo = await dbTodos.findOne(query)
  if(!todo) return null
  const response = {
    ...todo,
    isOwner(userId) {
      return userId === this.ownerId
    }
  }
  console.log(response)
  return response
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