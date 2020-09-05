const { dbChecklists } = require('../database/createDB')

async function saveChecklist(checklist) {
  return await dbChecklists.insert(checklist)
}

async function findChecklist(query) {
  return await dbChecklists.findOne(query)
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