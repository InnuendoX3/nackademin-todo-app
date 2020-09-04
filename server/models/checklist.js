const { dbChecklists } = require('../database/createDB')

async function saveChecklist(checklist) {
  return await dbChecklists.insert(checklist)
}

module.exports = {
  saveChecklist
}