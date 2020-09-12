const path = require('path')
const userModel = require('../models/user')
const checklistModel = require('../models/checklist')
const todoModel = require('../models/todo')

function getPrivacyPolicy(req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/privacy-policy.html'))
}

async function deleteUserAndContent(req, res) {
  const userId = req.user.userId
  let checklistsDeleted = 0
  let todosDeleted = 0

  try {
    const checklists = await checklistModel.findChecklists({ ownerId: userId })
    for (const checklist of checklists) {
      // Remove all todos from each checklist
      todosDeleted += await todoModel.removeTodo({ listedOn: checklist._id }) 
    }
    // Remove all checklist from user
    checklistsDeleted = await checklistModel.removeChecklist({ ownerId: userId })
    // Remove user
    const userDeleted = await userModel.removeUser({ _id: userId })
    
    if(!userDeleted) return res.status(400).send({ message: 'Something went wrong. User not found' })
    const message = 'Your account and all content has been deleted succesfully'
    const data = { checklistsDeleted, todosDeleted }
    res.status(200).send({message, data})

  } catch (error) {
    console.error(error)
    res.status(400).send({ message: error.toString()})
  }


}

module.exports = {
  getPrivacyPolicy,
  deleteUserAndContent
}