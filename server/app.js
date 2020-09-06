require('dotenv').config()

const express = require('express')
const todoRouter = require('./routes/todo')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')

const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/login', authRouter)
app.use('/todos', todoRouter)
app.use('/users', userRouter)

module.exports = app
