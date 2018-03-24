import 'babel-polyfill'
import chai, { expect } from 'chai'
import request from 'supertest'
import server from 'server/server'
import { Mood, User } from 'server/data/models'
import slugify from 'slug'
import { loginUser } from '../../test/middlewares/authApi.test'
import users from 'server/data/fixtures/users'
chai.should();

const   user = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        moodName = "random name",
        slug = slugify(moodName)

export default describe('/moods API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()

    })

    // clean up
    after(function() {
        Mood.destroy({where: { name: moodName }})
    })

    it('POST mood', async function() {
        const agent = await loginUser(username, password)
        await agent.post('/api/moods')
            .send({ name: moodName })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                return res.body.slug.should.be.equal(slug)
            })
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
    })

    describe('GET moods', function() {

        it('GET random moods', async function() {
            await request(server)
                .get('/api/moods/random')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    const { moods } = res.body
                    moods.should.be.a('array')
                    moods.should.have.length(11) // TODO: why not 12?
                    moods.forEach(mood => {
                        expect(mood).to.have.property('Nodes').a('array')
                        // For preview image there must be 0 or 1 node in array
                        expect(mood.Nodes.length).to.not.greaterThan(1)
                        if (mood.Nodes[0]) expect(mood.Nodes[0].MoodId).to.eq(String(mood.id))
                    })
                })
        })

        it('GET popular moods', function(done) {
            request(server)
                .get('/api/moods/popular')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, {body}) {
                    if (err) return done(err);
                    // test for descending order
                    body.moods.forEach(mood => {
                        // console.log('mood: ', mood.rating)
                    })
                    body.moods.should.be.a('array')
                    done()
                });
        })

        it('GET new moods', function(done) {
            request(server)
                .get('/api/moods/new')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, {body}) {
                    if (err) return done(err);
                    // test for descending order
                    body.moods.forEach(mood => {
                        // console.log('mood: ', mood.createdAt)
                    })
                    body.moods.should.be.a('array')
                    done()
                });
        })


        // it('GET moods by user', function(done) {
        //     User.findOne({
        //         where: {},
        //         order: 'rand()',
        //     })
        //     .then(randomUser => {
        //         const UserId = randomUser.id
        //         request(server)
        //             .get('/api/moods/user/' + UserId)
        //             .expect('Content-Type', /json/)
        //             .expect(200)
        //             .end(function(err, {body}) {
        //                 if (err) return done(err)
        //                 body.moods.should.be.a('array')
        //                 body.moods.forEach(mood => {
        //                     expect(mood.UserId == UserId)
        //                 })
        //                 done()
        //             })
        //     })
        // })


    })

    it('GET single mood', function(done) {
        user
            .get('/api/moods/mood/' + slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.name.should.be.equal(moodName)
                done()
            });
    })

    it('GET /search moods', async function() {
        await user
            .get('/api/moods/search/' + 'something' )
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                res.body.moods.should.be.a('array')
            })
    })
    // TODO create test for "mustLogin" function and this kind of tests will be obsolete
    it('fail to POST if not authorized', function(done) { // TODO move this to previous function?
        user
            .post('/api/moods')
            .send({ name: moodName })
            .expect(401, done)
    })

})