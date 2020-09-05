const { dbChecklists } = require('../database/createDB')

async function saveChecklist(checklist) {
  return await dbChecklists.insert(checklist)
}

async function findChecklist(query) {
  return await dbChecklists.findOne(query)
}

module.exports = {
  saveChecklist,
  findChecklist
}