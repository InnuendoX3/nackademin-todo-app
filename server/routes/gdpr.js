const express = require('express')
const router = express.Router()
const gdprController = require('../controllers/gdpr')

router.get('/', gdprController.getPrivacyPolicy)

module.exports = router