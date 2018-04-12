import chai, { assert, expect } from 'chai'
import request from 'supertest'
import server from '../../server.js'
import { User, Local, Profile, sequelize } from '../../data/models'
import select from 'selectn'
import { loginUser } from './authApi.test'
import users from '../../data/fixtures/users'
chai.should();

export default describe('/users API', function() {

    // Kill supertest server in watch mode to avoid errors
    before(() => server.close())
    after(() => server.close())

    it('get one user', async function() {
        const user = await User.findOne({order: sequelize.random()})
        await request(server)
            .get(`/api/users/user/${user.id}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function({body}) {
                assert(body.id, 'must have an id')
                assert(body.Profile, 'must have Profile')
                expect(body.moods).to.be.a('array')
                // assert(body.moods[0].UserId == body.id)
                // TODO
                // assert(!body.Local, 'must not have Local')
            })
    })

    it('update user profile', async function() {
        const {username, password} = users[0]
        const localAuth = await Local.findOne({where: {username}})
        const agent = await loginUser(username, password)
        await agent
            .put(`/api/users/user/${localAuth.UserId}`)
            .send({language: 'fr'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function(res) {
                const language = select('body.Profile.language', res)
                assert(language == 'fr', 'changed language improperly')
            })
    })

    // it('must fail to update other user', async function() {
    //     try {
    //         const user = await User.findOne({order: sequelize.random(), include: [Profile]})
    //         await request(server)
    //             .put(`/api/users/user/${user.username + 'not_me'}`)
    //             .send({language: 'fr'})
    //             .expect(500) // TODO
    //     }
    //     catch (error) {
    //         // console.error(error)
    //         throw new Error(error)
    //     }
    // })

    // it('fails to get user if no username provided', async function() {
    //     try {
    //         await request(server)
    //             .get('/api/users/user/')
    //             .expect(404)
    //             // .then(function(res) {
    //             //     console.log('res', res.body)
    //             // })
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error(error)
    //     }
    // })

})