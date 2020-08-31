const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

function adminAuthorization(req, res, next) {
  if(!req.headers.authorization) return res.sendStatus(403)
  const token = req.headers.authorization.replace('Bearer ', '')

  try {
    const payload = jwt.verify(token, secret)
    if(payload.role !== 'admin') return res.sendStatus(401)
    req.user = payload
    next()
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.TokenExpiredError) return res.status(400).send({message: 'Sesion expired. Log in again'})
    res.sendStatus(403)
  }
}

function userAuthorization(req, res, next) {
  if(!req.headers.authorization) return res.sendStatus(403)
  const token = req.headers.authorization.replace('Bearer ', '')
  
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.TokenExpiredError) return res.status(400).send({message: 'Sesion expired. Log in again'})
    res.sendStatus(403)
  }
}

module.exports = { 
  adminAuthorization,
  userAuthorization
}