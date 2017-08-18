import 'babel-polyfill'
import chai from 'chai'
import slugify from 'slug'
import request from 'supertest'
import server from 'src/server'
import users from 'src/server/data/fixtures/users'
import { ApiName, User } from 'src/server/data/models'
import { loginUser } from 'src/server/test/middlewares/authApi.test'
chai.should();

const   user = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        apiNameName = "random name",
        slug = slugify(apiNameName)

export default describe('/apiNames API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()

    })

    // clean up
    after(function() {
        ApiName.destroy({where: { name: apiNameName }})
    })

    it('POST apiName', async function() {
        const agent = await loginUser(username, password)
        await agent.post('/api/apiNames')
            .send({ name: apiNameName })
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

    it('GET apiNames', function(done) {
        request(server)
            .get('/api/apiNames')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.apiNames.should.be.a('array')
                done()
            });
    })

    it('GET single apiName', function(done) {
        user
            .get('/api/apiNames/apiName/' + slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.name.should.be.equal(apiNameName)
                done()
            });
    })

    it('GET /search apiNames', function(done) {
        user
            .get('/api/apiNames/search/' + 'something' )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.apiNames.should.be.a('array')
                done()
            });
    })
    // TODO create test for "mustLogin" function and this kind of tests will be obsolete
    it('fail to POST if not authorized', function(done) { // TODO move this to previous function?
        user
            .post('/api/apiNames')
            .send({ name: apiNameName })
            .expect(401, done)
    })

})