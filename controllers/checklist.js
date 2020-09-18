const checklistModel = require('../models/checklist')
const todoModel = require('../models/todo')

async function getAllChecklists(req, res) {
  let filter = {} //Admin
  if(req.user.role === 'user') {
    filter = { ownerId: req.user.userId }
  }

  try {
    const checklists = await checklistModel.findChecklists(filter)
    res.status(200).send(checklists)
  } catch (error) {
    console.error(error)
    res.status(400).send({ message: error.toString()})
  }

}

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
  const userId = req.user.userId
  const role = req.user.role
  const filter = { _id: checklistId }

  try {
    const checklist = await checklistModel.findChecklist(filter)
    if( role !== 'admin' && checklist.ownerId.toString() !== userId ) return res.sendStatus(401)
    const todos = await todoModel.findTodos({ listedOn: checklist._id })
    const fullChecklist = {
      ...checklist,
      todos
    }
    //console.log('fullChecklist', fullChecklist)
    res.status(200).send(fullChecklist)
  } catch (error) {
    console.error(error)
    res.status(400).send({ message: error.toString() })
  } 
}

async function deleteChecklist(req, res) {
  const checklistId = req.params.checklistId
  const role = req.user.role
  const userId = req.user.userId
  let filter = { _id: checklistId } // Admin

  if( role === 'user' )  filter = { _id: checklistId, ownerId: userId }

  try {
    const numChecklistsDeleted = await checklistModel.removeChecklist(filter)
    if(!numChecklistsDeleted) return res.status(401).send({ message: 'Not authorized / Not found' })
    const numTodosDeleted = await todoModel.removeTodo({ listedOn: checklistId })
    const response = {
      message: `${numChecklistsDeleted} checklists deleted`,
      qtyTodosDeleted: numTodosDeleted
    }
    res.status(200).send(response)
  } catch (error) {
    console.error(error)
    res.status(400).send({ message: error.toString() })
  }
}

async function editChecklist(req, res) {
  const checklistId = req.params.checklistId
  const userId = req.user.userId
  const role = req.user.role

  let filter = { _id: checklistId} // Admin
  const toUpdate = { title: req.body.title }

  if( role === 'user' ) filter = { _id: checklistId, ownerId: userId }

  try {
    const response = await checklistModel.updateChecklist(filter, toUpdate)
    if (!response) return res.status(401).send({ message: 'Not authorized / Not found' })
    res.status(200).send(response)
  } catch (error) {
    console.error(error)
    res.status(400).send({ message: error.toString() })    
  }

}

module.exports = {
  getAllChecklists,
  create,
  getChecklist,
  deleteChecklist,
  editChecklist
}