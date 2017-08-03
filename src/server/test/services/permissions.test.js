import 'babel-polyfill'
import chai from 'chai'
import request from 'supertest'
import server from '../../server'
import { Mood, User } from '../../data/models'
import slugify from 'slug'
import { mustLogin } from '../../services/permissions'
import { loginUser } from '../middlewares/authApi.test'
import users from '../../data/fixtures/users'
chai.should();

const   user = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        moodName = "random name",
        slug = slugify(moodName)

export default describe('permissions service', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
        // login user
        await loginUser(username, password)
    })

    // clean up
    after(function() {
        Mood.destroy({where: { name: moodName }})
    })

    it('success if logged in', async function() {
        const agent = await loginUser(username, password)
        await agent
            .post('/api/moods')
            .send({ name: moodName })
            .expect('Content-Type', /json/)
            .expect(200)
    })

    it('fail if not logged in', function(done) {
        user
            .post('/api/moods')
            .send({ name: moodName + 'x' })
            .expect('Content-Type', /json/)
            .expect(401, done)
    })

})