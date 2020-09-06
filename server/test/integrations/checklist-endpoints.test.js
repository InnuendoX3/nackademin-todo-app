const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai
const app = require('../../app')
const userModel = require('../../models/user')
const { clearDatabases } = require('../../database/createDB')

describe('Testing checklist endpoints', () => {

  beforeEach( async function() {
    clearDatabases()
    const userToSave = { username: 'Paula', password: '12345', role: 'user'}
    const userSaved = await userModel.saveUser(userToSave)
    this.currentTest.userId = userSaved._id
    this.currentTest.token = await userModel.authenticate('Paula', '12345')

  })

  it('POST /checklist. Create checklist', function() {
    const body = {title: 'First list'}

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
      })
  })

/*   it('Test login', () => {
    const body = { username: 'blabla', password: 'asdfasdf'}
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(body)
      .end((err, resp) => {
        expect(resp).to.be.json
        expect(resp).to.have.status(400)
        expect(resp.body).to.have.all.keys('message')
        expect(resp.body.message).to.be.a('string')
      })
  }) */
})