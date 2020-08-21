const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo')

router.post('/', todoController.create)

module.exports = router