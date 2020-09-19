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

async function findChecklists(query) {
  return await ChecklistModel.find(query)
}

async function saveChecklist(checklist) {
  const newChecklist = new ChecklistModel(checklist)
  //console.log('newChecklist', newChecklist)
  return await newChecklist.save()
}


async function findChecklist(query) {
  const checklist = await ChecklistModel.findOne(query)
  // console.log('checklist i model', checklist)
  return checklist
}

async function removeChecklist(query) {
  const response = await ChecklistModel.deleteMany(query)
  return response.deletedCount
}

async function updateChecklist(query, toUpdate) {
  return await ChecklistModel.findOneAndUpdate(query, toUpdate, { new: true })
}

// Only clear on tests
async function clear() {
  if (process.env.ENVIRONMENT === 'test') return await ChecklistModel.deleteMany({})
}

module.exports = {
  findChecklists,
  saveChecklist,
  findChecklist,
  removeChecklist,
  updateChecklist,
  clear
}