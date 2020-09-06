const { dbChecklists } = require('../database/createDB')
const todoModel = require('./todo')

async function saveChecklist(checklist) {
  return await dbChecklists.insert(checklist)
}

// Return Checklist with its todos
async function findChecklist(query) {
  const checklist = await dbChecklists.findOne(query)
  const todos = await todoModel.findTodos({ listedOn: checklist._id })
  const fullChecklist = {
    ...checklist,
    todos
  }
  return fullChecklist
}

async function removeChecklist(query) {
  return await dbChecklists.remove(query)
}

async function updateChecklist(query, toUpdate) {
  return await dbChecklists.update(query, { $set: toUpdate }, { returnUpdatedDocs: true })
}

module.exports = {
  saveChecklist,
  findChecklist,
  removeChecklist,
  updateChecklist
}