const checklistModel = require("../models/checklist")

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

module.exports = {
  create
}