const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')

const { dbConnect, dbDisconnect  } = require('../../database/createDB')
const userModel = require('../../models/user')
const checklistModel = require('../../models/checklist')
const todoModel = require('../../models/todo')

describe('GDPR', function() {

  before( async function() {
    await dbConnect()
  })

  beforeEach( async function() {
    // Clear Databases
    await userModel.clear()
    await checklistModel.clear()
    await todoModel.clear()
    
    // Create user
    const person = { username: 'Pepito', password: '12345', role: 'user' }
    const user = await userModel.saveUser(person)
    
    // Create checklists with some todos
    for(let i=0; i<5; i++) {
      const checklist = await checklistModel.saveChecklist({
        title: `What I got to do #${i}`,
        ownerId: user._id
      })
      // Create todos
      for(let j=0; j<6; j++) {
        await todoModel.saveTodo({
          title: `Todo number ${j} from checklist ${i}`,
          isDone: false,
          ownerId: user._id,
          listedOn: checklist._id
        })
      }
    }

    // User Id . Needed ??
    this.currentTest.userId = user._id

    // Login
    this.currentTest.userToken = await userModel.authenticate(person.username, person.password)
    
  })

  after(async function () {
    await dbDisconnect()
  })

  it('A user can delete his account and all his content', async function() {
    const resp = await request(app)
      .delete('/gdpr/forget-me-please')
      .set('authorization', `Bearer ${this.test.userToken}`)
      .send()
    
    expect(resp).to.be.json
    expect(resp).to.have.status(200)
    expect(resp.body).to.have.all.keys(['message', 'data'])
    expect(resp.body.data).to.have.all.keys(['checklistsDeleted', 'todosDeleted'])
    expect(resp.body.data.checklistsDeleted).to.equal(5)
    expect(resp.body.data.todosDeleted).to.equal(30)
  })

  it('Show all user info and content: Checklist and todos', async function() {
    const resp = await request(app)
      .get('/gdpr/show-me-my-data')
      .set('authorization', `Bearer ${this.test.userToken}`)
      .send()

    expect(resp).to.have.status(200)
    expect(resp).to.be.json
    expect(resp.body).to.have.all.keys(['username', 'role', 'checklists'])
    expect(resp.body.checklists.length).to.equal(5)
    expect(resp.body.checklists[0]).to.have.all.keys(['title', 'todos'])
    expect(resp.body.checklists[0].todos.length).to.equal(6)
  })


})