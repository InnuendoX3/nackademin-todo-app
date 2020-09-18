//const { dbChecklists } = require('../database/createDB')
const mongoose = require('mongoose')

const checklistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

const ChecklistModel = mongoose.model('Checklist', checklistSchema)


/** UserModel functions **/

// Mongo ok
async function findChecklists(query) {
  return await ChecklistModel.find(query)
}

// Mongo ok
async function saveChecklist(checklist) {
  const newChecklist = new ChecklistModel(checklist)
  return await newChecklist.save()
}

// Mongo // Fix todos
async function findChecklist(query) {
  const checklist = await ChecklistModel.findOne(query)
  return checklist
}

// Mongo // Fix todos
async function removeChecklist(query) {
  const response = await ChecklistModel.deleteMany(query)
  return response.deletedCount
}

// Mongo ok
async function updateChecklist(query, toUpdate) {
  return await ChecklistModel.findOneAndUpdate(query, toUpdate, { new: true })
}

module.exports = {
  findChecklists,
  saveChecklist,
  findChecklist,
  removeChecklist,
  updateChecklist
}