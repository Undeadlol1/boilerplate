import 'babel-polyfill'
import slugify from 'slug'
import uniq from 'lodash/uniq'
import request from 'supertest'
import server from 'server/server'
import { stringify } from 'query-string'
import { loginUser } from './authApi.test'
import chai, { should, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Mood, User, Local, Node, Decision, sequelize } from 'server/data/models'
chai.use(require('chai-datetime'));
chai.should();

const   agent = request.agent(server),
        apiUrl = '/api/decisions/',
        user = users[0],
        vote = true

export default describe('/decisions API', function() {

    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    // clean up
    after(function() {
        server.close()
    })


    // describe('POST', async function() {

    //     it('creates decision', async function() {
    //         const node = await Node.findOne({order: sequelize.random()})
    //         const loggedIn = await loginUser(user.username, user.password)
    //         await loggedIn
    //                 .post(apiUrl)
    //                 .send({
    //                     vote,
    //                     NodeId: node.id,
    //                 })
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .then(async ({body}) => {
    //                     expect(body.vote).eq(true)
    //                     // TODO check this
    //                     Number(node.rating) > 0
    //                     ? expect(body.NodeRating).above(node.rating)
    //                     : expect(body.NodeRating).below(node.rating)
    //                     // make sure node.rating is updated
    //                     const updatedNode = await Node.findById(node.id)
    //                     expect(updatedNode.rating == body.NodeRating)
    //                 })
    //     })


    //     it('fails if not logged in', async function() {
    //         await agent.post(apiUrl).expect(401)
    //     })
    // })

    // describe('PUT', async function() {

    //     it('updates decision', async function() {
    //         const   UserId = await Local
    //                                 .findOne({where: {username: user.username} })
    //                                 .then(local => local.UserId),
    //                 decision = await Decision.findOne({where: {UserId}}),
    //                 node = await Node.findById(decision.NodeId),
    //                 agent = await loginUser(user.username, user.password)
    //         await agent
    //             .put(apiUrl)
    //             .send({id: decision.id, vote: !decision.vote})
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .then(async ({body}) => {
    //                 expect(body.vote).eq(!decision.vote)
    //                 // TODO check this
    //                 Number(node.rating) > 0
    //                 ? expect(body.NodeRating).below(node.rating)
    //                 : expect(body.NodeRating).abowe(node.rating)
    //                 // make sure node.rating is updated
    //                 const updatedNode = await Node.findById(node.id)
    //                 expect(updatedNode.rating == body.NodeRating)
    //             })
    //     })

    //     it('fails if not logged in', async function() {
    //         await agent.put(apiUrl).expect(401)
    //     })
    // })
})