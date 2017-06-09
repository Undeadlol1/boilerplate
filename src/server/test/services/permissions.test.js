import 'babel-polyfill'
import chai from 'chai'
import request from 'supertest'
import server from '../../server'
import { Mood, User } from '../../data/models'
import slugify from 'slug'
import { mustLogin } from '../../services/permissions'
chai.should();

const   user = request.agent(server),
        username = "somename",
        password = "somepassword",
        moodName = "random name",
        slug = slugify(moodName)

export default describe('permissions service', function() {
    
    before(function(done) {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()

        // Create user and login
        user
            .post('/api/auth/signup')
            .send({ username, password })
            .end(result => {
                user
                    .post('/api/auth/login')
                    .send({ username, password })
                    .expect(302)
                    .end(error => {
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

    it('success if logged in', function(done) {
        user
            .post('/api/moods')
            .send({ name: moodName })
            .expect('Content-Type', /json/)
            .expect(200, done)
    })

    it('fail if not logged in', function(done) {
        user
            .get('/api/auth/logout')
            .expect(200)
            .end(error => {
                if (error) return done(error)
                user
                    .post('/api/moods')
                    .send({ name: moodName + 'x' })
                    .expect('Content-Type', /json/)
                    .expect(401, done)
            }) 
        
    })    

})