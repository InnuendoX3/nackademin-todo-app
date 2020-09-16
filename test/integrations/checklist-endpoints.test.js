const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')

const { clearDatabases } = require('../../database/createDB')
const checklistModel = require('../../models/checklist')
const userModel = require('../../models/user')
const todoModel = require('../../models/todo')

describe('Integration test: Checklists endpoints', () => {

  beforeEach( async function() {
    clearDatabases()
    // Login and save userId and Token
    const userToSave = { username: 'Paula', password: '12345', role: 'user'}
    const userSaved = await userModel.saveUser(userToSave)
    this.currentTest.userId = userSaved._id
    this.currentTest.token = await userModel.authenticate('Paula', '12345')
  })

  it('GET /checklists Get all checklists', async function() {
    for(let i=0; i<3; i++) {
      const cheklist = { title: 'Dummy checklist', ownerId: this.test.userId }
      await checklistModel.saveChecklist(cheklist)
    }

    const resp = await request(app)
      .get('/checklists')
      .set('authorization', `Bearer ${this.test.token}`)
      .send()
    expect(resp).to.be.json
    expect(resp).to.have.status(200)
    expect(resp.body.length).to.equal(3)
    expect(resp.body[0]).to.have.all.keys(['_id', 'title', 'ownerId'])
    expect(resp.body[0].ownerId).to.equal(this.test.userId)

  })


  it('POST /checklists Create checklist', async function() {
    const body = { title: 'First list' }
    
    const resp = await request(app)
      .post('/checklists')
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${this.test.token}`)
      .send(body)
    expect(resp).to.be.a('object')
    expect(resp).to.have.status(201)
    expect(resp.body).to.have.all.keys(['message', 'data'])
    expect(resp.body.data.ownerId).to.equal(this.test.userId)

  })
  

  it('GET /checklists/:someChecklistId Get a checklist with its Todos', async function() {
    const userId = this.test.userId
    const newList = { title: 'Get me back!', ownerId: userId }
    const checklistSaved = await checklistModel.saveChecklist(newList)
    for(let i=0; i<5; i++) {
      const todo = {
        title: 'I am a todo',
        isDone: false,
        ownerId: userId,
        listedOn: checklistSaved._id
      }
      await todoModel.saveTodo(todo)
    }

    const resp = await request(app)
      .get(`/checklists/${checklistSaved._id}`)
      .set('authorization', `Bearer ${this.test.token}`)
      .send()
    expect(resp).to.be.json
    expect(resp).to.have.status(200)
    expect(resp.body).to.have.all.keys(['_id', 'title', 'ownerId', 'todos'])
    expect(resp.body.title).to.equal('Get me back!')
    expect(resp.body.ownerId).to.equal(userId)
    expect(resp.body.todos.length).to.equal(5)

  })


  it('DELETE /checklists/:someChecklistId Delete a checklist', async function() {
    const newChecklist = { title: 'Delete me!', ownerId: this.test.userId }
    const savedChecklist = await checklistModel.saveChecklist(newChecklist)
    for(let i=0; i<5; i++) {
      const todo = {
        title: 'I am a todo for deleting',
        isDone: false,
        ownerId: this.test.userId,
        listedOn: savedChecklist._id
      }
      await todoModel.saveTodo(todo)
    }
  
    const resp = await request(app)
      .delete(`/checklists/${savedChecklist._id}`)
      .set('authorization', `Bearer ${this.test.token}`)
      .send()
    expect(resp).to.be.json
    expect(resp).to.have.status(200)
    expect(resp.body).to.have.all.keys(['message','qtyTodosDeleted'])
    expect(resp.body.qtyTodosDeleted).to.equal(5)
  
  })


  it('PATCH /checklists/:someChecklistId Update a checklist', async function() {
    const newChecklist = { title: 'Update me!', ownerId: this.test.userId }
    const savedChecklist = await checklistModel.saveChecklist(newChecklist)

    const whatToUpdate = { title: 'My title has been updated' }

    const resp = await request(app)
      .patch(`/checklists/${savedChecklist._id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${this.test.token}`)
      .send(whatToUpdate)
    expect(resp).to.be.json
    expect(resp).to.have.status(200)
    expect(resp.body).to.have.all.keys(['title', 'ownerId', '_id'])
    expect(resp.body.title).to.equal('My title has been updated')
  })


})
