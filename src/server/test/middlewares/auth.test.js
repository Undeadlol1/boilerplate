import chai, { assert } from 'chai'
import request from 'supertest'
import server from '../../server.js'
import { User } from '../../data/models'
import select from 'selectn'

chai.should();

const user = request.agent(server)   

/**
 * @export
 * @param {String} username 
 * @param {String} password 
 * @returns request agent function
 */
export function loginUser(username, password) {
    return user
        .post('/api/auth/login')
        .send({ username, password })
        .expect(302)
        .then(result => user)
}

export default describe('Authethication tests', function() {
    
    const   username = 'somename',
            password = 'somepassword'

    
    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    after(function() {
        server.close()
        User.destroy({where: { username }})
    })

    it('create user', function() {
        return user
                .post('/api/auth/signup')
                .send({ username, password })
                .expect(302)
    })
    // TODO write vk and twitter auth tests
    // TODO test if username exists already
    // TODO test if password is incorrect

    it('login user', function() {
        return loginUser(username, password)
    })

    it('get logged in user', async function() {
        try {
            await user
                .get('/api/auth/current_user')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(function(res) {
                    assert(select('body.id', res), 'must have an id')
                    assert(select('body.Profile.id', res), 'must have a profile')
                })
        }
        catch (error) {
            console.error(error)
            throw new Error(error)
        }
    })

    it('logout user', function(done) { // TODO move this to previous function?
        loginUser(username, password)
        // TODO test logout more properly
        user
            .get('/api/auth/logout')
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            })
    })

})