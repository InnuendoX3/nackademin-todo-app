const express = require('express')
const router = express.Router()
const checklistController = require('../controllers/checklist')
const { userAuthorization } = require('../middlewares/authorization')

router.post('/', userAuthorization, checklistController.create)
router.get('/:checklistId', userAuthorization, checklistController.getChecklist)

module.exports = router