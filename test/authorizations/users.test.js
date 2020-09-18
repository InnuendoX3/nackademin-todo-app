const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')

const  { clearDatabases, dbConnect, dbDisconnect } = require('../../database/createDB')
const userModel = require('../../models/user')
const checklistModel = require('../../models/checklist')
const todoModel = require('../../models/todo')
const authorization = require('../../middlewares/authorization')

describe('User authorization', function() {

  before(async function() {
    await dbConnect()
  })
  
  after( async function () {
    await dbDisconnect()
  })

  beforeEach( async function() {
    clearDatabases()
    const person2 = { username: 'iAmUser1', password: '12345', role: 'user' }
    const person3 = { username: 'iAmUser2', password: '12345', role: 'user' }
    const userA = await userModel.saveUser(person2)
    const userB = await userModel.saveUser(person3)

    // UserA: Make 4 checklist and 2 todos per Checklist
    for(let i=0; i<4; i++) {
      const checklistUserA = await checklistModel.saveChecklist({
        title: `Things I got to do UserA #${i}`,
        ownerId: userA._id
      })
      for(let j=0; j<2; j++) {
        await todoModel.saveTodo({
          title: `Just a todo ${j}`,
          isDone: false,
          ownerId: userA._id,
          listedOn: checklistUserA._id
        })
      }
    }

    // UserB: Make 3 checklist and 2 todos per Checklist
    for(let i=0; i<3; i++) {
      const checklistUserB = await checklistModel.saveChecklist({
        title: `Things I got to do UserB #${i}`,
        ownerId: userB._id
      })
      for(let j=0; j<2; j++) {
        await todoModel.saveTodo({
          title: `Just a todo ${j}`,
          isDone: false,
          ownerId: userB._id,
          listedOn: checklistUserB._id
        })
      }
    }

    // Users Id for compare on test
    this.currentTest.idUserA = userA._id.toString()
    this.currentTest.idUserB = userB._id.toString()

    // Login everyone
    this.currentTest.userAToken = await userModel.authenticate(person2.username, person2.password)
    this.currentTest.userBToken = await userModel.authenticate(person3.username, person3.password)

  })


  it('User cannot get all the Checklists as Admin do', async function() {
    const resp = await request(app)
      .get('/checklists')
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send()
    
    expect(resp).to.be.json
    expect(resp).to.have.status(200)
    expect(resp.body.length).to.equal(4)
    expect(resp.body[0].ownerId).to.equal(this.test.idUserA)
  })

  it('UserA cannot get UserB checklists', async function() {
    const checklistUserB = await checklistModel.findChecklist({ ownerId: this.test.idUserB })

    const resp = await request(app)
      .get(`/checklists/${checklistUserB._id}`)
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send()

    expect(resp).to.have.status(401)
  })


  it('User cannot delete others checklist', async function() {
    const checklistUserB = await checklistModel.findChecklist({ ownerId: this.test.idUserB })

    const resp = await request(app)
      .delete(`/checklists/${checklistUserB._id}`)
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send()

    expect(resp).to.have.status(401)
  })

  it('User cannot update others checklist', async function() {
    const checklistUserB = await checklistModel.findChecklist({ ownerId: this.test.idUserB })
    const somethingNew = { title: 'I should not change at all' }

    const resp = await request(app)
      .patch(`/checklists/${checklistUserB._id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send(somethingNew)

    expect(resp).to.have.status(401)
    expect(resp.body).to.have.all.keys(['message'])

  })

  // User cannot take action on other users
  it('User cannot get other users', async function() {
    const resp = await request(app)
      .get(`/users/${this.test.idUserB}`)
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send()

    expect(resp).to.have.status(401)
  })

  it('User cannot update other users', async function() {
    const toUpdate = { username: 'User Z', password: '4321', role: 'admin' }

    const resp = await request(app)
      .patch(`/users/${this.test.idUserB}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send(toUpdate)

    expect(resp).to.have.status(401)
  })

  it('User cannot delete other users', async function() {
    const resp = await request(app)
      .delete(`/users/${this.test.idUserB}`)
      .set('authorization', `${this.test.userAToken}`)

    expect(resp).to.has.status(401)
  })

  // User cannot take action on others todos
  it('User cannot get others todos', async function() {
    const todoUserB = await todoModel.findTodo({ ownerId: this.test.idUserB })
    
    const resp = await request(app)
    .get(`/todos/${todoUserB._id}`)
    .set('authorization', `Bearer ${this.test.userAToken}`)
    .send()
    
    expect(resp).to.have.status(401)
  })
  
  it('User cannot update others todos', async function() {
    const todoUserB = await todoModel.findTodo({ ownerId: this.test.idUserB })
    const toUpdate = { title: 'I will not be updated!' }

    const resp = await request(app)
      .patch(`/todos/${todoUserB._id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send(toUpdate)

    expect(resp).to.have.status(401)
  })

  it('User cannot delete others todos', async function() {
    const todoUserB = await todoModel.findTodo({ ownerId: this.test.idUserB })
    
    const resp = await request(app)
      .delete(`/todos/${todoUserB._id}`)
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send()

    expect(resp).to.have.status(401)
  })





})