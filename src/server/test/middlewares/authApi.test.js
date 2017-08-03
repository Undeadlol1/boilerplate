import chai, { assert, expect } from 'chai'
import request from 'supertest'
import server from '../../server.js'
import { User, Local } from '../../data/models'

chai.should();

const   user     = request.agent(server)
const   username = 'somename',
        password = 'somepassword',
        email    = 'some@gmail.com'

/**
 * @export
 * @param {string} username
 * @param {string} password
 * @returns request agent function
 */
export function loginUser(username, password) {
    return user
        .post('/api/auth/login')
        .send({ username, password })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(({body}) => {
            assert(body.id)
            assert(body.Local.username == username)
        })
        .then(() => user)
}

/**
 * @export
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @returns request agent function
 */
export function createUser(email, username, password) {
    return user
        .post('/api/auth/signup')
        .send({ username, password, email })
        .expect(200)
        .then(({body}) => {
            body.displayName.should.eq(username)
            body.should.have.property('Profile')
            // TODO disabled because Local should not be send to client
            // body.Local.email.should.eq(email)
            // body.Local.username.should.eq(username)
            // body.Local.password.should.not.eq(password)
        })
}

export function failLogin(body, status = 401) {
    return user
            .post('/api/auth/login')
            .send(body)
            .expect(status)
            .then(res => {
                // console.log(res);
                return res.error.text
            })
}

export default describe('/auth', function() {


    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    after(function() {
        server.close()
    })

    // TODO test if username exists already
    // TODO test if password is incorrect
    // TODO test if params or not used
    it('create user', async function() {
        try {
            await createUser(email, username, password)
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    })
    // TODO write vk and twitter auth tests

    describe('login user', function() {
        it('logs in', async function() {
            await loginUser(username, password)
        })

        it('fails for non existing user', async () => {
            const   username = 'notexist',
                    password = username
            await failLogin({username, password})
                    .then(text => {
                        text.should.eq('User not exists')
                    })
        })

        it('fails with no username', async () => {
            await failLogin({
                        username: undefined,
                        password: 'something'
                    }, 400)
                    .then(text => {
                        text.should.eq('Invalid query')
                    })
        })

        it('fails with incorrect password', async () => {
            await failLogin({
                        username,
                        password: 'something'
                    })
                    .then(text => {
                        text.should.eq('Incorrect password')
                    })
        })
    })

    it('get logged in user', async function() {
        try {
            await user
                .get('/api/auth/current_user')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(function({body}) {
                    const local = body.Local
                    assert(body.id, 'must have an id')
                    assert(local.id, 'musth have Local.id')
                    assert(local.email == email)
                    assert(local.username == username)
                    // TODO
                    // assert(!local.password, 'must not have password')
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

    describe('login should fail if', function() {
        it('user not found', async function() {

        })
    })

})