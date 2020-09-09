const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')

const {clearDatabases} = require('../../database/createDB')
const userModel = require('../../models/user')
const checklistModel = require('../../models/checklist')
const todoModel = require('../../models/todo')

describe('User authorization', function() {

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
    this.currentTest.idUserA = userA._id
    this.currentTest.idUserB = userB._id

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
    const checklistsUserB = await checklistModel.findChecklist({ ownerId: this.test.idUserB })

    const resp = await request(app)
      .get(`/checklists/${checklistsUserB._id}`)
      .set('authorization', `Bearer ${this.test.userAToken}`)
      .send()

    expect(resp).to.have.status(401)
  })


  // 
  // User cannot delete other's checklist
  // User cannot update other's checklist

  // User cannot CRUDA other users

  // User cannot CRUDA others todos





})