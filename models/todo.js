const { dbTodos } = require('../database/createDB')
const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  listedOn: {
    type: mongoose.Schema.ObjectId,
    ref: 'Checklist',
    required: true
  }
})

const TodoModel = mongoose.model('Todo', todoSchema)

async function clear() {
  return await TodoModel.deleteMany({})
}

/** UserModel functions **/

// Mongo ok
async function findTodos(filter) {
  return await TodoModel.find(filter)
}

// Mongo ok
async function saveTodo(todo) {
  const newTodo = new TodoModel(todo)
  return await newTodo.save()
}

// Mongo ok
async function findTodo(filter) {
  const todo = await TodoModel.findOne(filter)
  if(!todo) return null
  const response = {
    ...todo._doc,
    isOwner(userId) {
      return userId === this.ownerId.toString()
    }
  }
  return response
}

// Mongo ok
async function removeTodo(filter) {
  const response = await TodoModel.deleteMany(filter)
  return response.deletedCount
}

// Mongo ok // Fail not sending an attribute. $set
async function updateTodo(filter, newTodo) {
  return await TodoModel.findOneAndUpdate(filter, newTodo, { new: true })
}

module.exports = {
  findTodos,
  saveTodo,
  findTodo,
  removeTodo,
  updateTodo,
  clear
}