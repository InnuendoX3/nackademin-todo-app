const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai
const app = require('../../app')

const { clearDatabases } = require('../../database/createDB')
const userModel = require('../../models/user')
const checklistModel = require('../../models/checklist')
const todoModel = require('../../models/todo')

describe('Integration test: Checklists endpoints', () => {

  beforeEach( async function() {
    clearDatabases()
    const userToSave = { username: 'Paula', password: '12345', role: 'user'}
    const userSaved = await userModel.saveUser(userToSave)
    this.currentTest.userId = userSaved._id
    this.currentTest.token = await userModel.authenticate('Paula', '12345')

  })

  it('POST /checklists Create checklist', function(done) {
    const body = { title: 'First list' }
    
    request(app)
    .post('/checklists')
    .set('Content-Type', 'application/json')
    .set('authorization', `Bearer ${this.test.token}`)
    .send(body)
    .end((err, resp) => {
      expect(resp).to.be.a('object')
      expect(resp).to.have.status(201)
      expect(resp.body).to.have.all.keys(['message', 'data'])
      expect(resp.body.data.ownerId).to.equal(this.test.userId)
      done()
    })
  })
  
  it('GET /checklists: Get a checklist with its Todos', async function() {
    const newList = { title: 'Get me back!', ownerId: this.test.userId }
    const checklistSaved = await checklistModel.saveChecklist(newList)
    const userId = this.test.userId //For the expect. Don't work directly
    for(let i=0; i<5; i++) {
      const todo = {
        title: 'I am a todo',
        isDone: false,
        ownerId: this.test.userId,
        listedOn: checklistSaved._id
      }
      await todoModel.saveTodo(todo)
    }
    
    request(app)
      .get(`/checklists/${checklistSaved._id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${this.test.token}`)
      .send()
      .end(function (err, resp) {
        expect(resp).to.be.json
        expect(resp).to.have.status(200)
        expect(resp.body).to.have.all.keys(['_id', 'title', 'ownerId', 'todos'])
        expect(resp.body.title).to.equal('Get me back!')
        expect(resp.body.ownerId).to.equal(userId)
        expect(resp.body.todos.length).to.equal(5)
      })
  })

})