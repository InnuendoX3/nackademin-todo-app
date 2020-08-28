const Datastore = require('nedb-promises')
const db = Datastore.create({
  filename: './database/store.db',
  timestampData: true,
  autoload: true
})

module.exports = db