require('dotenv').config()

const express = require('express')
const todoRouter = require('./routes/todo')
const userRouter = require('./routes/user')
const accountRouter = require('./routes/account')

const cors = require('cors')

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

app.use('/login', accountRouter)
app.use('/todos', todoRouter)
app.use('/users', userRouter)

app.listen(port, () => console.log(`Server listening on port ${port}`))