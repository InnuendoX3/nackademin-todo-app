const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')

const { clearDatabases } = require('../../database/createDB')
const userModel = require('../../models/user')
const checklistModel = require('../../models/checklist')
const todoModel = require('../../models/todo')

describe('GDPR', function() {

  before( async function() {
    clearDatabases()
    
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


})