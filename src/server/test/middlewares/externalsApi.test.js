import 'babel-polyfill'
import chai, { should, expect } from 'chai'
import request from 'supertest'
import server from '../../server'
import { Mood, User, Node, Decision } from '../../data/models'
import slugify from 'slug'
import uniq from 'lodash/uniq'
import users from '../../data/fixtures/users'
import { stringify } from 'query-string'
chai.use(require('chai-datetime'));
chai.should();

const   user = request.agent(server)

export default describe('/externals API', function() {

    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    // clean up
    after(function() {
        server.close()
    })


    describe('/search?selector', async function() {
        const route = '/api/externals/search'
        try {
            it('fails without "selector"', async function() {
                await user.get(`${route}?`).expect(400)
            })
            it('gets response properly', async function() {
                const query = stringify({query: 'highly suspect'})
                await user
                        .get(`${route}?${query}`)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .then(({body}) => {
                            expect(body.length).to.be.equal(4)
                            body.map(video => {
                                return expect(video.id.videoId).to.be.an('string')
                            })
                        })
            })
        } catch (error) {
            throw new Error(error)
        }
    })

})