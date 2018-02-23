import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import generateUuid from 'uuid/v4'
import chai, {expect, assert} from 'chai'
import users from 'server/data/fixtures/users'
import { Threads, Forums, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should()

const   agent = request(server),
        username = users[0].username,
        password = users[0].password,
        thread = "random name",
        slug = slugify(thread)

export default describe('/threads API', function() {
    // Kill supertest server in watch mode to avoid errors
    before(async () => await server.close())
    // clean up
    after(async () => await Threads.destroy({where: { name: thread }}))

    it('POST thread', async function() {
        const text = "sometext"
        const parentId = generateUuid() // random id
        const user = await loginUser(username, password)
        await user.post('/api/threads')
            .send({ name: thread, parentId, text })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function(res) {
                res.body.text.should.be.equal(text)
                res.body.slug.should.be.equal(slug)
                res.body.parentId.should.be.equal(parentId)
            })
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
    })

    it('GET threads', async function() {
        // const forum = await Forums.findOne({sort: 'rand()'})
        await agent
            .get('/api/threads/' + 'random id')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.totalPages.should.eq(1)
                body.currentPage.should.eq(1)
                body.values.should.be.a('array')
            })
    })

    it('GET single thread', async () => {
        await agent
            .get('/api/threads/thread/' + slug )
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                res.body.name.should.be.equal(thread)
                // includes user object
                res.body.User.id.should.be.defined
            })
    })

    // TODO: PUT test

    // FIXME: comments
    describe('fails to POST if', () => {
        it('not authorized', async () => await agent.post('/api/threads').expect(401))

        const values = [
            // {property: 'name', value: null, error: 'Name is required'}, // FIXME: what about this?
            {property: 'name', value: undefined, error: 'Name is required'},
            {property: 'name', value: '', error: 'Name must be between 5 and 100 characters long'},
            {property: 'name', value: ' ', error: 'Name must be between 5 and 100 characters long'},
            {property: 'text', value: undefined, error: 'Text is required'},
            {property: 'text', value: '', error: 'Text should be atleast 5 characters long'},
            {property: 'text', value: ' ', error: 'Text should be atleast 5 characters long'},
            {property: 'parentId', value: undefined, error: 'Parent id is required'},
            {property: 'parentId', value: '', error: 'Parent id is not valid UUID'},
            {property: 'parentId', value: ' ', error: 'Parent id is not valid UUID'},
        ]

        values.map(({property, value, error}) => {
            it(`${property} not validated`, async () => {
                const user = await loginUser(username, password)
                await user
                .post('/api/threads')
                .send({[property]: value})
                .expect(422)
                .expect('Content-Type', /json/)
                .then(({body}) => {
                    expect(body.errors[property].msg).to.eq(error)
                })
                .catch(error => {throw error})
            })
        })
    })

})