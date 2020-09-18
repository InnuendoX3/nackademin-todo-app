const environment = process.env.ENVIRONMENT
const mongoose = require('mongoose')

let mongoDatabase

switch (environment) {
  case 'development':
    mongoDatabase = { getUri: () => process.env.DB_URL }
    break
  case 'test':
		const { MongoMemoryServer } = require('mongodb-memory-server')
		mongoDatabase = new MongoMemoryServer({ binary: { version: '4.4.1' } })
    break

  default:
    console.log('Environment not found')
    break;
}


async function dbConnect() {
  const dbUrl = await mongoDatabase.getUri()
  
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,    // Something deprecated
    useUnifiedTopology: true, // Something deprecated
    useFindAndModify: false   // Something deprecated
  })
  
  const status = mongoose.connection
  
/*   status.on('connected', () => {
    console.log('Connected to DB')
  })
  status.on('disconnected', () => {
    console.log('Disconnected from DB')
  }) */
  status.on('error', err => {
    console.log(err)
  })
}

async function dbDisconnect() {
  await mongoose.disconnect()
  if(process.env.ENVIRONMENT == 'test' || process.env.ENVIRONMENT == 'development'){
    await mongoDatabase.stop()
  }
}


// Used on test environment
async function clearDatabases() {
  if(environment === 'test') {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
}


module.exports = {
  dbConnect,
  dbDisconnect,
  clearDatabases
}