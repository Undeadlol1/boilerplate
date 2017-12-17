import 'babel-polyfill'
import chai from 'chai'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import generateUuid from 'uuid/v4'
import users from 'server/data/fixtures/users'
import { Threads, Forums, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();

const   user = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        thread = "random name",
        slug = slugify(thread)

export default describe('/threads API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    // clean up
    after(function() {
        Threads.destroy({where: { name: thread }})
    })

    it('POST thread', async function() {
        const text = "sometext"
        const parentId = generateUuid() // random id
        const agent = await loginUser(username, password)
        await agent.post('/api/threads')
            .send({ name: thread, parentId, text })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                res.body.text.should.be.equal(text)
                res.body.parentId.should.be.equal(parentId)
                return res.body.slug.should.be.equal(slug)
            })
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
    })

    it('GET threads', async function() {
        // const forum = await Forums.findOne({sort: 'rand()'})
        await request(server)
            .get('/api/threads/' + 'random id')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                res.body.totalPages.should.eq(1)
                res.body.currentPage.should.eq(1)
                res.body.values.should.be.a('array')
            });
    })

    it('GET single thread', function(done) {
        user
            .get('/api/threads/thread/' + slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.name.should.be.equal(thread)
                // includes user object
                res.body.User.id.should.be.defined
                done()
            });
    })

    // TODO PUT test

    // TODO create test for "mustLogin" function and this kind of tests will be obsolete
    it('fail to POST if not authorized', function(done) { // TODO move this to previous function?
        user
            .post('/api/threads')
            .send({ name: thread })
            .expect(401, done)
    })

})