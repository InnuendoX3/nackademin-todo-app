const app = require('./app')
const port = process.env.PORT

const { dbConnect } = require('./database/createDB')


dbConnect().then( () => {
  app.listen( port, () => console.log(`Server listening on port ${port}`))
})
