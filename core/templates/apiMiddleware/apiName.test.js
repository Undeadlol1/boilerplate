import 'babel-polyfill'
import request from 'supertest'
import server from 'server/server'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Plural, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should()
chai.use(require('chai-properties'))

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        where = {where: {name}, raw: true}

export default describe('/plural API', function() {
    // Kill supertest server in watch mode to avoid errors
    before(() => server.close())
    // clean up
    after(async () => await Plural.destroy({where: {name}}))

    // POST test is intentionally first
    // because other tests rely on created singular
    it('POST singular', async () => {
        const user = await loginUser(username, password)
        await user.post('/api/plural')
            .send({ name })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.name.should.be.equal(name)
            })
    })

    it('GET plural', async () => {
        await agent
            .get('/api/plural')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.totalPages.should.eq(1)
                body.currentPage.should.eq(1)
                body.values.should.be.a('array')
                body.values.should.have.length(1)
            })
    })

    it('GET single singular', async () => {
        const singular = await Plural.findOne(where)
        await agent
            .get('/api/plural/singular/' + singular.id )
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.name.should.be.equal(name)
            })
    })

    it('PUT singular', async () => {
        const user = await loginUser(username, password)
        const singular = await Plural.findOne(where)
        const payload = {
            name: 'some name',
            something: 'something',
        }
        await user.put('/api/plural/' + singular.id)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                expect(body).to.have.properties(payload)
            })
    })

    it('DELETE singular', async () => {
        const singular = await Plural.findOne(where)
        assert.isNotNull(
            singular,
            'document does not exist before DELETE'
        )
        const user = await loginUser(username, password)
        await user
            .put('/api/plural/' + singular.id)
            .expect(200)
        assert.isNull(
            await Plural.findById(singular.id),
            'document was not deleted'
        )
    })

    it('fail to POST if not authorized', async () => {
        await agent.post('/api/plural').expect(401)
    })

    it('fail to PUT if not authorized', async () => {
        await agent.put('/api/plural/someId').expect(401)
    })

    it('fail to DELETE if not authorized', async () => {
        await agent.delete('/api/plural/someId').expect(401)
    })

})