const Datastore = require('nedb-promises')

const dbTodos = Datastore.create({
  filename: './database/storeTodos.db',
  timestampData: true,
  autoload: true
})

const dbUsers = Datastore.create({
  filename: './database/storeUsers.db',
  autoload: true
})

module.exports = {
  dbTodos,
  dbUsers
}