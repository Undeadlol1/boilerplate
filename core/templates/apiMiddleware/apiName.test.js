import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Plural, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();
chai.use(require('chai-properties'))

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name)

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
                body.slug.should.be.equal(slug)
            })
    })

    it('GET plural', async () => {
        await agent
            .get('/api/plural')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.plural.should.be.a('array')
            })
    })

    it('GET single singular', async () => {
        await agent
            .get('/api/plural/singular/' + slug )
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.name.should.be.equal(name)
            })
    })

    it('PUT singular', async () => {
        const user = await loginUser(username, password)
        const plural = await Plural.findOne({order: 'rand()'})
        const payload = {
            name: 'some name',
            something: 'something',
        }
        await user.put('/api/plural/' + plural.id)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                expect(body).to.have.properties(payload)
            })
    })

    it('PUT singular', async () => {
        const user = await loginUser(username, password)
        const plural = await Plural.findOne({order: 'rand()'})
        const payload = {
            name: 'some name',
            something: 'something',
        }
        await user.put('/api/plural/' + plural.id)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                expect(body).to.have.properties(payload)
            })
    })

    it('DELETE singular', async () => {
        const plural = await Plural.findOne({order: 'rand()'})
        assert.isNotNull(
            plural,
            'document does not exist before DELETE'
        )
        const user = await loginUser(username, password)
        await user.put('/api/plural/' + plural.id)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/)
        assert.isNull(
            await Plural.findById(plural.id),
            'document was not deleted'
        )
    })

    it('fail to POST if not authorized', async () => {
        await agent.post('/api/plural').expect(401)
    })

    it('fail to PUT if not authorized', async () => {
        await agent.put('/api/plural').expect(401)
    })

    it('fail to DELETE if not authorized', async () => {
        await agent.delete('/api/plural').expect(401)
    })

})