const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  hashedPass: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

const UserModel = mongoose.model('User', userSchema)


/** UserModel functions **/

async function findUsers() {
  return await UserModel.find()
}

async function saveUser(user) {
  const userToSave = {
    username: user.username,
    role: user.role,
    hashedPass: bcrypt.hashSync(user.password, 10)
  }
  const newUser = new UserModel(userToSave)
  const tempResponse = await newUser.save()
  return tempResponse
}

async function findUser(filterQuery) {
  return await UserModel.findOne(filterQuery)
}

async function removeUser(filterQuery) {
  const response = await UserModel.deleteOne(filterQuery)
  return response.deletedCount
}

// TODO: Do not return hashed pass
async function updateUser(query, newUserData) {
  const newDataToSave = {
    username: newUserData.username,
    role: newUserData.role,
    hashedPass: bcrypt.hashSync(newUserData.password, 10)
  }
  const response = await UserModel.findOneAndUpdate(query, newDataToSave, { new: true })
  return response
}

// Only clear on tests
async function clear() {
  if (process.env.ENVIRONMENT === 'test') return await UserModel.deleteMany({})
}


/** Authentication functions */

async function findUserByUsername(username) {
  const query = { username }
  const user = await UserModel.findOne(query)
  return user
}

async function isPasswordCorrect(pass, hash) {
  return bcrypt.compareSync(pass, hash)
}

async function authenticate(username, password) {
  const user = await findUserByUsername(username)
  if(!user) {
    throw new Error('USERNAME or password incorrect')
  }

  const isPassword = await isPasswordCorrect(password, user.hashedPass)
  if(!isPassword) throw new Error('Username or PASSWORD incorrect')

  // JWT 
  const toEncrypt = {
    userId: user._id,
    role: user.role
  }
  const token = jwt.sign(toEncrypt, secret, { expiresIn: '1h' })
  return token
}

/**
 * Create a basic-first-user Admin
 * so the app is accesible for first time use
 */

async function createFirstUserAdmin(user) {
  // Looking for first-admin or other admins
  const firstUserAdmin = await findUserByUsername('Admin')
  const otherAdmins = await UserModel.findOne({ role: 'admin' })
  
  // If no first-admin or admins at all, create first-admin
  if( !firstUserAdmin && !otherAdmins ) {
    const user = {
      username: 'Admin',
      role: 'admin',
      hashedPass: bcrypt.hashSync('Admin', 10)

    }
    const firstAdmin = new UserModel(user)
    const response = await firstAdmin.save()
    if(response) return console.log('First Admin created -> Username: Admin Password: Admin')
  }

}


module.exports = {
  findUsers,
  saveUser,
  findUser,
  removeUser,
  updateUser,
  findUserByUsername,
  isPasswordCorrect,
  authenticate,
  clear,
  createFirstUserAdmin
}