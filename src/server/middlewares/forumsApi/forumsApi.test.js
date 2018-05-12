import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import chai, { assert } from 'chai'
import users from 'server/data/fixtures/users'
import { loginUser } from 'server/test/middlewares/authApi.test'
import { Forums, User, Local, sequelize } from 'server/data/models'
chai.should()

const   username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name)

export default describe('/forums API', function() {
    // Kill supertest server in watch mode to avoid errors.
    before(async () => await server.close())
    // Clean up.
    after(async () => Forums.destroy({where: {name}}))

    it('GET forums', async () => {
        await request(server)
            .get('/api/forums')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.totalPages.should.eq(1)
                body.currentPage.should.eq(1)
                body.values.should.be.a('array')
            })
    })

    it('GET single forum', async function() {
        const forum = await Forums.findOne({order: sequelize.random()})
        await request(server)
            .get('/api/forums/forum/' + forum.slug )
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function(res) {
                const { name, threads } = res.body
                // has forum
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
        await request(server)
            .post('/api/forums')
            .send({ name })
            .expect(401)
    })

    it('fail to POST if user is not an admin', async function() {
        const user = await loginUser(username, password)
        await user
            .post('/api/forums')
            .send({ name })
            .expect(401)
    })

    it('fail to PUT if user is not an admin', async function() {
        const user = await loginUser(username, password)
        await user
            .put('/api/forums/' + 'random name')
            .send({ name })
            .expect(401)
            .catch(error => {throw error})
    })

})