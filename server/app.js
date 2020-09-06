require('dotenv').config()

const express = require('express')
const userRouter = require('./routes/user')
const checklistRouter = require('./routes/checklist')
const todoRouter = require('./routes/todo')
const authRouter = require('./routes/auth')

const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/users', userRouter)
app.use('/checklists', checklistRouter)
app.use('/todos', todoRouter)
app.use('/login', authRouter)

module.exports = app
