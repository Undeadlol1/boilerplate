import 'babel-polyfill'
import request from 'supertest'
import server from 'server/server'
import generateUuid from 'uuid/v4'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Votes, User } from 'server/data/models'
import { loginUser, getUserIdByUsername } from 'server/test/middlewares/authApi.test'
chai.should();

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        parentId = generateUuid()
// vote id will be set in POST test and
// will used in "after" section to clean up
let voteId;

export default describe('/votes API', function() {

    // Kill supertest server in watch mode to avoid errors
    before(async () =>  await server.close())
    // clean up
    after(async () => await Votes.destroy({where: {id: voteId}}))

    it('POST vote', async function() {
        const UserId = await getUserIdByUsername(username)
        const user = await loginUser(username, password)
        await user.post('/api/votes')
            .send({ parentId, value: true })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({body}) => {
                // set id for later clean up
                voteId = body.id
                body.should.have.properties({
                    UserId,
                    parentId,
                    value: true,
                })
            })
    })

    it('fail to POST if not authorized', function(done) {
        agent.post('/api/votes').expect(401, done)
    })

    it('GET single vote', function(done) {
        agent
            .get('/api/votes/vote/' + voteId )
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.id.should.equal(voteId)
                done()
            });
    })

    it('GET votes', async () => {
        await request(server)
            .get('/api/votes/' + parentId)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                res.body.totalPages.should.eq(1)
                res.body.currentPage.should.eq(1)
                res.body.values.should.be.a('array')
            })
    })

    it('PUT vote', async function() {
        const user = await loginUser(username, password)
        await user.put('/api/votes/' + voteId)
            .send({ value: false })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.should.have.property('value', false)
            })
    })

    it('fail to PUT if not same user', async function() {
        const diffrentUser = await loginUser(users[2].username, users[2].password)
        await diffrentUser.put('/api/votes/' + voteId).expect(401)
    })


})