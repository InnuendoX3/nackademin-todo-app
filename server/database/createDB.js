const Datastore = require('nedb-promises')
const db = Datastore.create({
  filename: './database/store.db',
  autoload: true,
})

module.exports = db