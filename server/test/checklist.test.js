const { expect, use } = require('chai')
const { clearDatabases } = require('../database/createDB')
const checklistModel = require('../models/checklist')

describe('Checklist tests:', () => {
  beforeEach(() => {
    clearDatabases()
  })

  it('Create a checklist', async () => {
    // Arrange
    const userId = 'FakeUserId5hopApqxmYnhzjML'
    const checklistToSave = { title: 'My first list', ownerId: userId }

    // Act
    const createdList = await checklistModel.saveChecklist(checklistToSave)

    // Assert
    expect(createdList).to.be.a('object')
    expect(createdList).to.have.all.keys(['_id', 'title', 'ownerId'])
    expect(createdList.ownerId).to.equal(userId)
  })

  it('Get a checklist by its id', async () => {
    // Arrange
    const userId = 'FakeUserId5hopApqxmYnhzjML'
    const checklistToSave = { title: 'My first list', ownerId: userId }
    const createdList = await checklistModel.saveChecklist(checklistToSave)

    // Act
    const checklist = await checklistModel.findChecklist({ _id: createdList._id })

    // Assert
    expect(checklist).to.be.a('object')
    expect(checklist).to.have.all.keys(['_id', 'title', 'ownerId'])
    expect(checklist.ownerId).to.equal(userId)
    expect(checklist._id).to.equal(createdList._id)
  })
})