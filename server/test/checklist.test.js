const { expect } = require('chai')
const userModel = require('../models/user')
const checklistModel = require('../models/checklist')

describe('Checklist tests:', () => {
  
  it('Create a checklist', async () => {
    // Arrange
    const user = await userModel.saveUser({
      username: 'Pepe Perez',
      password: '654321',
      role: 'user'
    })
    const checklist = { title: 'My first list', ownerId: user._id }
    
    // Act
    const createdList = await checklistModel.saveChecklist(checklist)
    
    // Assert
    expect(createdList).to.be.a('object')
    expect(createdList).to.have.all.keys(['_id', 'title', 'ownerId'])
    expect(createdList.ownerId).to.equal(user._id)

  })
})