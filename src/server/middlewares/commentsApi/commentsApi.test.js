import 'babel-polyfill'
import chai from 'chai'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import users from 'server/data/fixtures/users'
import { Comments, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();

const   user = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        comment = "random name",
        slug = slugify(comment)

export default describe('/comments API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()

    })

    // clean up
    after(function() {
        Comments.destroy({where: { name: comment }})
    })

    // it('POST comment', async function() {
    //     const agent = await loginUser(username, password)
    //     await agent.post('/api/comments')
    //         .send({ name: comment })
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .then(function(res) {
    //             return res.body.slug.should.be.equal(slug)
    //         })
    //         .catch(error => {
    //             console.error(error)
    //             throw new Error(error)
    //         })
    // })

    // it('GET comments', function(done) {
    //     request(server)
    //         .get('/api/comments')
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) return done(err);
    //             res.body.comments.should.be.a('array')
    //             done()
    //         });
    // })

    // it('GET single comment', function(done) {
    //     user
    //         .get('/api/comments/comment/' + slug )
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) return done(err);
    //             res.body.name.should.be.equal(comment)
    //             done()
    //         });
    // })

    // // TODO PUT test

    // // TODO create test for "mustLogin" function and this kind of tests will be obsolete
    // it('fail to POST if not authorized', function(done) { // TODO move this to previous function?
    //     user
    //         .post('/api/comments')
    //         .send({ name: comment })
    //         .expect(401, done)
    // })

})