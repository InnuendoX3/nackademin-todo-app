const express = require('express')
const router = express.Router()
const gdprController = require('../controllers/gdpr')
const { userAuthorization } = require('../middlewares/authorization')

router.get('/', gdprController.getPrivacyPolicy)
router.get('/show-me-my-data', userAuthorization, gdprController.getUserAndContent)
router.delete('/forget-me-please', userAuthorization, gdprController.deleteUserAndContent)


module.exports = router