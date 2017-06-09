import 'babel-polyfill'
import chai from 'chai'
import request from 'supertest'
import server from '../../server'
import { Mood, User } from '../../data/models'
import slugify from 'slug'
chai.should();

const   user = request.agent(server),
        username = "somename",
        password = "somepassword",
        moodName = "random name",
        slug = slugify(moodName)

export default describe('/moods API', function() {
    
    before(function(done) {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
        // Create user and login
        user
            .post('/api/auth/signup')
            .send({ username, password })
            .end(function(error, result) {
                if (error) return done(error)
                user
                    .post('/api/auth/login')
                    .send({ username, password })
                    .expect(302)
                    .end((error, result) => {
                        if (error) return done(error)
                        done()
                    })
            })
    })

    // clean up
    after(function() {
        User.destroy({where: { username }})
        Mood.destroy({where: { name: moodName }})        
    })

    it('POST mood', function(done) {
        user
            .post('/api/moods')
            .send({ name: moodName })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){ 
                if (err) return done(err);
                res.body.slug.should.be.equal(slug)
                done()
        })
    })

    it('GET moods', function(done) {
        request(server)
            .get('/api/moods')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.moods.should.be.a('array')
                done()
            });
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

    it('GET /search moods', function(done) {
        user
            .get('/api/moods/search/' + 'something' )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.moods.should.be.a('array')                
                done()
            });
    })
    // TODO create test for "mustLogin" function and this kind of tests will be obsolete
    it('fail to POST if not authorized', function(done) { // TODO move this to previous function?
        // TODO how to test if user is logged in?
        user
            .get('/api/auth/logout')
            .expect(200)
            .end(err => {
                if (err) return done(err);
                user
                    .post('/api/moods')
                    .send({ name: moodName })
                    .expect(401, done)
            })
    })

})