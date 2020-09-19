const { expect } = require('chai')
const { clearDatabases, dbConnect, dbDisconnect  } = require('../../database/createDB')
const checklistModel = require('../../models/checklist')
const userModel = require('../../models/user')

describe('Checklist tests:', () => {

  before( async function() {
    await dbConnect()
  })

  beforeEach( async function() {
    //clearDatabases()
    await userModel.clear()
    await checklistModel.clear()
    
    const person1 = { username: 'iAmUser1', password: '12345', role: 'user' }
    const userA = await userModel.saveUser(person1)

    // Users Id for compare on test
    this.currentTest.idUserA = userA._id
  })

  after(async function () {
    await dbDisconnect()
  })


  it('Create a checklist', async function() {
    const userId = this.test.idUserA
    const checklistToSave = { title: 'My first list', ownerId: userId }

    const createdList = await checklistModel.saveChecklist(checklistToSave)

    expect(createdList).to.be.a('object')
    expect(createdList._doc).to.have.all.keys(['__v', '_id', 'title', 'ownerId'])
    expect(createdList.ownerId.toString()).to.equal(userId.toString())
  })

  it('Get a checklist by its id', async function() {
    const userId = this.test.idUserA
    const checklistToSave = { title: 'My first list', ownerId: userId }
    const createdList = await checklistModel.saveChecklist(checklistToSave)
    const query = { _id: createdList._id.toString() }
    
    const checklist = await checklistModel.findChecklist(query)

    expect(checklist).to.be.a('object')
    expect(checklist._doc).to.have.all.keys(['__v', '_id', 'title', 'ownerId'])
    expect(checklist.ownerId.toString()).to.equal(userId.toString())
    expect(checklist._id.toString()).to.equal(createdList._id.toString())
  })

  it('Delete a checklist', async function() {
    const userId = this.test.idUserA
    const checklistToDelete = { title: 'Delete me, please', ownerId: userId }
    const createdList = await checklistModel.saveChecklist(checklistToDelete)
    const query = { _id: createdList._id }

    const numDeleted = await checklistModel.removeChecklist(query)

    expect(numDeleted).to.be.a('number')
    expect(numDeleted).to.equal(1)
  })

  it('Update a checklist', async function() {
    const userId = this.test.idUserA
    const checklistToUpdate = { title: 'Modify me', ownerId: userId }
    const createdList = await checklistModel.saveChecklist(checklistToUpdate)
    const query = { _id: createdList._id}
    const toUpdate = { title: 'Modify me, please!' }

    const updatedChecklist = await checklistModel.updateChecklist(query, toUpdate)

    expect(updatedChecklist).to.be.a('object')
    expect(updatedChecklist._doc).to.has.all.keys(['__v','_id', 'title', 'ownerId'])
    expect(updatedChecklist.title).to.equal('Modify me, please!')
  })

})