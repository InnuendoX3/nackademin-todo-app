const db = require('../database/createDB.js')

async function saveTodo(todo) {
  return await db.insert(todo)
}

module.exports = {
  saveTodo,
}