//const { dbChecklists } = require('../database/createDB')
const mongoose = require('mongoose')

const checklistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  }
  /* ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  } */
})

const ChecklistModel = mongoose.model('Checklist', checklistSchema)


async function findChecklists(query) {
  return await dbChecklists.find(query)
}

async function saveChecklist(checklist) {
  const newChecklist = new ChecklistModel(checklist)
  return await newChecklist.save()
  // return await dbChecklists.insert(checklist)
}

async function findChecklist(query) {
  const checklist = await dbChecklists.findOne(query)
  return checklist
}

async function removeChecklist(query) {
  return await dbChecklists.remove(query, {multi: true})
}

async function updateChecklist(query, toUpdate) {
  return await dbChecklists.update(query, { $set: toUpdate }, { returnUpdatedDocs: true })
}

module.exports = {
  findChecklists,
  saveChecklist,
  findChecklist,
  removeChecklist,
  updateChecklist
}