import chai, { assert } from 'chai'
import request from 'supertest'
import server from '../../server.js'
import { User, Profile } from '../../data/models'
import select from 'selectn'
import { loginUser } from './auth.test'
import users from '../../data/fixtures/users'
chai.should();

export default describe('/users API', function() {
    
    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    after(function() {
        server.close()
    })

    it('get one user', async function() {
        try {
            const user = await User.findOne({order: 'rand()'})
            await request(server)
                .get(`/api/users/user/${user.username}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(function(res) {
                    assert(select('body.id', res), 'must have an id')
                    assert(select('body.Profile.id', res), 'must have a profile')
                    assert(res.body.username == user.username, 'must have appropriate name')
                })
        }
        catch (error) {
            console.error(error)
            throw new Error(error)
        }
    })
    
    it('update user profile', async function() {
        try {
            const user = users[0]
            const agent = await loginUser(user.username, user.password)
            await agent
                .put(`/api/users/user/${user.username}`)
                .send({language: 'fr'})
                .expect(200)
                .expect('Content-Type', /json/)
                .then(function(res) {
                    const language = select('body.Profile.language', res)
                    assert(language == 'fr', 'changed language improperly')
                })
        }
        catch (error) {
            console.error(error)
            throw new Error(error)
        }
    })

    // it('must fail to update other user', async function() {
    //     try {
    //         const user = await User.findOne({order: 'rand()', include: [Profile]})
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