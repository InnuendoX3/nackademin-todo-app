const db = require('../database/createDB.js')

async function saveTodo(todo) {
  const response = await db.insert(todo)
  console.log(response)
  return response
}

module.exports = {
  saveTodo,
}