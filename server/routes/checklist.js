const express = require('express')
const router = express.Router()
const checklistController = require('../controllers/checklist')
const { userAuthorization } = require('../middlewares/authorization')

router.post('/', userAuthorization, checklistController.create)

module.exports = router