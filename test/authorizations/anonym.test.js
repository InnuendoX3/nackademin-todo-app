const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')

describe('Anonym user authorization', function() {
  
  // User path
  it('Anonym user cannot get all users', async function() {
    const resp = await request(app)
      .get('/users/')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })
  
  it('Anonym user cannot get an user', async function() {
    const resp = await request(app)
      .get('/users/fakeid')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })

  it('Anonym user cannot delete an user', async function() {
    const resp = await request(app)
      .delete('/users/fakeid')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })

  it('Anonym user cannot update an user', async function() {
    const resp = await request(app)
      .delete('/users/fakeid')
      .set('Content-Type', 'application/json')
      .set('authorization', '')
      .send({username: 'fakeuser'})
    
    expect(resp).to.have.status(403)
  })

  // Checklist path
  it('Anonym user cannot get all checklists', async function() {
    const resp = await request(app)
      .get('/checklists/')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })
  
  it('Anonym user cannot get a checklist', async function() {
    const resp = await request(app)
      .get('/checklists/fakeid')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })

  it('Anonym user cannot delete a checklist', async function() {
    const resp = await request(app)
      .delete('/checklists/fakeid')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })

  it('Anonym user cannot update a checklist', async function() {
    const resp = await request(app)
      .delete('/checklists/fakeid')
      .set('Content-Type', 'application/json')
      .set('authorization', '')
      .send({title: 'faketitle'})
    
    expect(resp).to.have.status(403)
  })

  // Toeo path
  it('Anonym user cannot get all todos', async function() {
    const resp = await request(app)
      .get('/todos/')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })
  
  it('Anonym user cannot get a todo', async function() {
    const resp = await request(app)
      .get('/todos/fakeid')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })

  it('Anonym user cannot delete a todo', async function() {
    const resp = await request(app)
      .delete('/todos/fakeid')
      .set('authorization', '')
      .send()
    
    expect(resp).to.have.status(403)
  })

  it('Anonym user cannot update a todo', async function() {
    const resp = await request(app)
      .delete('/todos/fakeid')
      .set('Content-Type', 'application/json')
      .set('authorization', '')
      .send({title: 'faketitle'})
    
    expect(resp).to.have.status(403)
  })

})
