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


/** UserModel functions **/

async function findTodos(filter) {
  return await TodoModel.find(filter)
}

async function saveTodo(todo) {
  const newTodo = new TodoModel(todo)
  return await newTodo.save()
}

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

async function removeTodo(filter) {
  const response = await TodoModel.deleteMany(filter)
  return response.deletedCount
}

// Mongo ok // Fail not sending an attribute. $set
async function updateTodo(filter, newTodo) {
  return await TodoModel.findOneAndUpdate(filter, newTodo, { new: true })
}

// Only clear on tests
async function clear() {
  if (process.env.ENVIRONMENT === 'test') return await TodoModel.deleteMany({})
}


module.exports = {
  findTodos,
  saveTodo,
  findTodo,
  removeTodo,
  updateTodo,
  clear
}