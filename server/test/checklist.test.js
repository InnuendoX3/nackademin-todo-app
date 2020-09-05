const { expect, use } = require('chai')
const { clearDatabases } = require('../database/createDB')
const checklistModel = require('../models/checklist')
const { query } = require('express')

describe('Checklist tests:', () => {
  beforeEach(() => {
    clearDatabases()
  })

  it('Create a checklist', async () => {
    const userId = 'FakeUserId5hopApqxmYnhzjML'
    const checklistToSave = { title: 'My first list', ownerId: userId }

    const createdList = await checklistModel.saveChecklist(checklistToSave)

    expect(createdList).to.be.a('object')
    expect(createdList).to.have.all.keys(['_id', 'title', 'ownerId'])
    expect(createdList.ownerId).to.equal(userId)
  })

  it('Get a checklist by its id', async () => {
    const userId = 'FakeUserId5hopApqxmYnhzjML'
    const checklistToSave = { title: 'My first list', ownerId: userId }
    const createdList = await checklistModel.saveChecklist(checklistToSave)
    const query = { _id: createdList._id }

    const checklist = await checklistModel.findChecklist(query)

    expect(checklist).to.be.a('object')
    expect(checklist).to.have.all.keys(['_id', 'title', 'ownerId'])
    expect(checklist.ownerId).to.equal(userId)
    expect(checklist._id).to.equal(createdList._id)
  })

  it('Delete a checklist', async () => {
    const userId = 'FakeUserId5hopApqxmYnhzjML'
    const checklistToDelete = { title: 'Delete me, please', ownerId: userId }
    const createdList = await checklistModel.saveChecklist(checklistToDelete)
    const query = { _id: createdList._id }

    const numDeleted = await checklistModel.removeChecklist(query)

    expect(numDeleted).to.be.a('number')
    expect(numDeleted).to.equal(1)
  })

  it('Update a checklist', async () => {
    const userId = 'FakeUserId5hopApqxmYnhzjML'
    const checklistToUpdate = { title: 'Modify me', ownerId: userId }
    const createdList = await checklistModel.saveChecklist(checklistToUpdate)
    const query = { _id: createdList._id}
    const toUpdate = { title: 'Modify me, please!' }

    const updatedChecklist = await checklistModel.updateChecklist(query, toUpdate)

    expect(updatedChecklist).to.be.a('object')
    expect(updatedChecklist).to.has.all.keys(['_id', 'title', 'ownerId'])
    expect(updatedChecklist.title).to.equal('Modify me, please!')
  })

})