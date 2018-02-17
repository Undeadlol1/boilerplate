import 'babel-polyfill'
import chai from 'chai'
import sinon from 'sinon'
import request from 'supertest'
import server from 'server/server'
import users from 'server/data/fixtures/users'
import { Mood, User } from 'server/data/models'
import { mustLogin, isAdmin } from 'server/services/permissions'
import { loginUser } from 'server/test/middlewares/authApi.test'
import { assert } from 'hoek';
chai.should();

const   user = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        moodName = "random name"

export default describe('permissions middleware', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
        // login user
        await loginUser(username, password)
    })

    // clean up
    after(function() {
        Mood.destroy({where: { name: moodName }})
    })

    describe('"mustLogin" is', function() {
        it('success if user is logged in', async function() {
            const agent = await loginUser(username, password)
            await agent
                .post('/api/moods')
                .send({ name: moodName })
                .expect('Content-Type', /json/)
                .expect(200)
        })

        it('fails if user is logged in', function(done) {
            user
                .post('/api/moods')
                .send({ name: moodName + 'x' })
                .expect('Content-Type', /json/)
                .expect(401, done)
        })
    })

    describe('"isAdmin"', function() {
        it('calls done() if user is admin', function() {
            const done = sinon.spy()
            const user = {id: process.env.ADMIN_ID}
            isAdmin({user}, {}, done)
            assert(done.calledOnce)
        })

        it('does not call done() if user is not admin', function() {
            const done = sinon.spy()
            const unauthorized = sinon.spy()
            const user = {id: 'random name'}
            isAdmin(
                {user}, // req
                {boom: {unauthorized}}, // res
                done
            )
            assert(done.notCalled)
            assert(unauthorized.calledOnce)
            assert(unauthorized.calledWith('You must be an administrator to do this'))
        })
    })

})