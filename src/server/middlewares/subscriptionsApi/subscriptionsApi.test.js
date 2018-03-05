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
// TODO: this was left after copy\paste
const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name),
        parentId = generateUuid()
// UserId is set in POST test after subscripption creaetion
let UserId

export default describe('/subscriptions API', function() {
    // Kill supertest server in watch mode to avoid errors
    before(async () => await server.close())
    // clean up
    after(async () => await Subscriptions.destroy({where: { parentId }}))
    // POST test purposely goes first
    it('POST subscription', async function() {
        const user = await loginUser(username, password)
        await user
            .post('/api/subscriptions')
            .send({ parentId })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({body}) => {
                // set UserId for next tests
                UserId = body.UserId
                return body.parentId.should.be.equal(parentId)
            })
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
    })

    it('GET subscriptions', async () => {
        // just incase make sure that UserId is defined
        expect(UserId).to.not.be.undefined
        await agent
            .get('/api/subscriptions/' + UserId)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({body}) => {
                // pagination assertions
                body.totalPages.should.equal(1)
                body.currentPage.should.equal(1)
                body.values.should.be.a('array')
                body.values.forEach(sub => {
                    expect(sub).to.have.properties({UserId})
                })
            })
    })

    it('GET single subscription', async () => {
        const subscripption = await Subscriptions.findOne({where: {UserId}})
        await agent
            .get('/api/subscriptions/subscription/' + subscripption.id )
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) =>{
                expect(body).to.have.properties({
                    UserId,
                    parentId,
                    type: null,
                    id: subscripption.id,
                })
            })
    })

    it('PUT subscription', async () => {
        const subscripption = await Subscriptions.findOne({where: {UserId}})
        const user = await loginUser(username, password)
        await user
            .put('/api/subscriptions/' + subscripption.id)
            .send({type: 'something'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) =>{
                expect(body).to.have.properties({
                    UserId,
                    parentId,
                    // changes were indeed applied
                    type: 'something',
                    id: subscripption.id,
                })
            })
    })
    ////////////////////
    // FAILURE TESTS  //
    ////////////////////
    it('fail to POST if not authorized', async () => {
        await agent.post('/api/subscriptions').expect(401)
    })

    it('fail to PUT as different user', async () => {
        const differentUser = await loginUser(
            users[2].username,
            users[2].password
        )
        await differentUser
            .put('/api/subscriptions/' + generateUuid())
            .expect(401)
    })

    it('fail to PUT if not authorized', async () => {
        await agent.put('/api/subscriptions/' + generateUuid()).expect(401)
    })

})