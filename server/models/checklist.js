const { dbChecklists } = require('../database/createDB')

async function findChecklists(query) {
  return await dbChecklists.find(query)
}

async function saveChecklist(checklist) {
  return await dbChecklists.insert(checklist)
}

async function findChecklist(query) {
  const checklist = await dbChecklists.findOne(query)
  return checklist
}

async function removeChecklist(query) {
  return await dbChecklists.remove(query)
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