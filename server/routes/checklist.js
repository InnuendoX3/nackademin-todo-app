const express = require('express')
const router = express.Router()
const checklistController = require('../controllers/checklist')
const { userAuthorization } = require('../middlewares/authorization')

router.post('/', userAuthorization, checklistController.create)
router.get('/:checklistId', userAuthorization, checklistController.getChecklist)
router.delete('/:checklistId', userAuthorization, checklistController.deleteChecklist)
router.patch('/:checklistId', userAuthorization, checklistController.editChecklist)

module.exports = router