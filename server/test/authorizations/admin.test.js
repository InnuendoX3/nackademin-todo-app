const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')

const {clearDatabases} = require('../../database/createDB')
const userModel = require('../../models/user')
const checklistModel = require('../../models/checklist')
const todoModel = require('../../models/todo')

describe('Admin authorization', function() {

  beforeEach( async function() {
    clearDatabases()
    const person1 = { username: 'iAmAdmin', password: '12345', role: 'admin' }
    const person2 = { username: 'iAmUser1', password: '12345', role: 'user' }
    const person3 = { username: 'iAmUser2', password: '12345', role: 'user' }
    const admin = await userModel.saveUser(person1)
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
    

    // Login everyone
    this.currentTest.adminToken = await userModel.authenticate(person1.username, person1.password)
    this.currentTest.userAToken = await userModel.authenticate(person2.username, person2.password)
    this.currentTest.userBToken = await userModel.authenticate(person3.username, person3.password)

  })

  it('Admin can get all the Checklists', async function() {
    const resp = await request(app)
      .get('/checklists')
      .set('authorization', `Bearer ${this.test.adminToken}`)
      .send()
    
    expect(resp).to.be.json
    expect(resp).to.have.status(200)
    expect(resp.body.length).to.equal(7)
  })

  // Admin can get other's checklists
  // Admin can delete other's checklist
  // Admin can update other's checklist

  // Admin can CRUDA other users

  // Admin can CRUDA others todos





})