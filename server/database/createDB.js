const Datastore = require('nedb-promises')
const environment = process.env.ENVIRONMENT

let dbUsers,
    dbChecklists,
    dbTodos

switch (environment) {
  case 'development':
    dbUsers = Datastore.create({ filename: './database/storeUsers.db', autoload: true })
    dbChecklists = Datastore.create({ filename: './database/storeChecklists.db', autoload: true })
    dbTodos = Datastore.create({ filename: './database/storeTodos.db', timestampData: true, autoload: true })
    break

  case 'test':
    dbUsers = Datastore.create({ filename: './test/testStore/storeUsers.db', autoload: true })
    dbChecklists = Datastore.create({ filename: './test/testStore/storeChecklists.db', autoload: true })
    dbTodos = Datastore.create({ filename: './test/testStore/storeTodos.db', timestampData: true, autoload: true })
    break

  default:
    console.log('Environment not found')
    break;
}

// Used on test environment
function clearDatabases() {
  if(environment === 'test') {
    dbUsers.remove({}, {multi: true})
    dbChecklists.remove({}, {multi: true})
    dbTodos.remove({}, {multi: true})
  }
}


module.exports = {
  dbUsers,
  dbChecklists,
  dbTodos,
  clearDatabases
}