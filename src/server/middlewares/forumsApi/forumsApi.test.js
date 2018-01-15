import 'babel-polyfill'
import chai, { assert } from 'chai'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import users from 'server/data/fixtures/users'
import { Forums, User, Local } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();

const   user = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name)

export default describe('/forums API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()

    })

    // clean up
    after(function() {
        Forums.destroy({where: { name }})
    })

    it('GET forums', function(done) {
        request(server)
            .get('/api/forums')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.totalPages.should.eq(1)
                res.body.currentPage.should.eq(1)
                res.body.values.should.be.a('array')
                done()
            });
    })

    it('GET single forum', async function() {
        const forum = await Forums.findOne({sort: 'rand()'})
        await user
            .get('/api/forums/forum/' + forum.slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                const { name, threads } = res.body
                // has skill
                name.should.be.equal(forum.name)
                // includes threads
                threads.totalPages.should.eq(1)
                threads.currentPage.should.eq(1)
                threads.values.should.be.a('array')
                threads.values.map(thread => {
                    thread.parentId.should.eq(forum.id)
                })
                threads.values.should.have.length(10)
            })
    })

    // FIXME:
    // disabled for now besauce i have no idea how to test admin users stuff
    // it('POST forum', async function() {
    //     const user = await Local.findOne({where: {UserId: process.env.ADMIN_ID}})
    //     const agent = await loginUser(username, password)
    //     await agent.post('/api/forums')
    //         .send({ name })
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

    // TODO PUT test

    it('fail to POST if not authorized', async function() {
        await user
            .post('/api/forums')
            .send({ name })
            .expect(401)
            .catch(error => {
                console.log(error)
                throw error
            })                        
    })

    it('fail to POST if user is not an admin', async function() {
        // const user = await Local.findOne({where: {username}})
        // assert(user.UserId != process.env.ADMIN_ID)
        const agent = await loginUser(username, password)
        await agent
            .post('/api/forums')
            .send({ name })
            .expect(401)
    })

    it('fail to PUT if user is not an admin', async function() {
        // const user = await Local.findOne({where: {username}})        
        // assert(user.UserId != process.env.ADMIN_ID)
        const agent = await loginUser(username, password)
        await agent
            .put('/api/forums/' + 'random name')
            .send({ name })
            .expect(401)
            .catch(error => {throw error})            
    })


})