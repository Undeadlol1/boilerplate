import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Plural, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name)

export default describe('/plural API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()

    })

    // clean up
    after(function() {
        return Plural.destroy({where: { name }})
    })

    it('POST singular', async function() {
        const user = await loginUser(username, password)
        await user.post('/api/plural')
            .send({ name })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                return res.body.slug.should.be.equal(slug)
            })
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
    })

    it('GET plural', function(done) {
        agent
            .get('/api/plural')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.plural.should.be.a('array')
                done()
            });
    })

    it('GET single singular', function(done) {
        agent
            .get('/api/plural/singular/' + slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.name.should.be.equal(name)
                done()
            });
    })

    // TODO PUT test

    it('fail to POST if not authorized', function(done) {
        agent.post('/api/plural').expect(401, done)
    })

})