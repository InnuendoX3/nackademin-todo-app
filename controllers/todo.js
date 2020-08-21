function create(req, res) {
  console.log('Creando todo', req.body.todo)
  res.send(req.body.todo)
}

module.exports = {
  create,
}