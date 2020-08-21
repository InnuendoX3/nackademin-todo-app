const express = require('express')
const app = express()
const port = 3001

app.use('/', (req, res) => {
  res.send('Working')
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
