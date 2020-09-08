const checklistModel = require('../models/checklist')
const todoModel = require('../models/todo')

async function create(req, res) {
  const title = req.body.title
  const userId = req.user.userId
  const newChecklist = {
    title: title,
    ownerId: userId
  }
  try {
    const response = await checklistModel.saveChecklist(newChecklist)
    res
      .status(201)
      .send({ message: 'Checklist created', data: response })
  } catch (error) {
    console.error(error)
    res.status(400).send({ message: error.toString() })
  }
}

async function getChecklist(req, res) {
  const checklistId = req.params.checklistId

  try {
    const checklist = await checklistModel.findChecklist({ _id: checklistId })
    const todos = await todoModel.findTodos({ listedOn: checklist._id })
    const fullChecklist = {
      ...checklist,
      todos
    }
    res.status(200).send(fullChecklist)
  } catch (error) {
    console.error(error)
    res.status(400).send({ message: error.toString() })
  } 
} 

module.exports = {
  create,
  getChecklist
}