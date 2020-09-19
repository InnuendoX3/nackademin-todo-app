const app = require('./app')
const port = process.env.PORT

const { dbConnect } = require('./database/createDB')

// Create a first-admin 
const { createFirstUserAdmin } = require('./models/user')
createFirstUserAdmin()


dbConnect().then( () => {
  app.listen( port, () => console.log(`Server listening on port ${port}`))
})
