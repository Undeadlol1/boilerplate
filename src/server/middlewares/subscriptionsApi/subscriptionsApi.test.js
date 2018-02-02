import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import generateUuid from 'uuid/v4'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Subscriptions, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name),
        parentId = generateUuid()

export default describe('/subscriptions API', function() {

    before(function() {
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    // clean up
    after(function() {
        return Subscriptions.destroy({where: { parentId }})
    })

    // POST test purposely goes first
    it('POST subscription', async function() {
        const user = await loginUser(username, password)
        await user.post('/api/subscriptions')
            .send({ parentId })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                console.log('res: ', res.body);
                return res.body.parentId.should.be.equal(parentId)
            })
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
    })

    it('fail to POST if not authorized', function(done) {
        agent.post('/api/subscriptions').expect(401, done)
    })

    it('GET subscriptions', function(done) {
        agent
            .get('/api/subscriptions')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.subscriptions.should.be.a('array')
                done()
            });
    })

    it('GET single subscription', function(done) {
        agent
            .get('/api/subscriptions/subscription/' + slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.name.should.be.equal(name)
                done()
            });
    })

    // TODO PUT test

})