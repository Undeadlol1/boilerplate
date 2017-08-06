import request from 'supertest'
import server from 'server/server.js'
import chai, { assert, expect } from 'chai'
import { User, Local } from 'server/data/models'
import { createUser } from 'server/data/controllers/UserController'
chai.should();

export default describe('UserController', function() {
    describe('createUser', () => {
        const   username = 'misha',
                email    = 'misha@misha.com',
                password = 'djkhaled+cocoa+butter',
                userInfo = { username, email, password }

        it('creates user object and local auth object', async () => {
            const expected = await createUser('Local', userInfo)
            const actual = await User.findOne({
                where: {},
                include: {
                    model: Local,
                    where: {username}
                }
            })
            expect(expected.displayName).to.equal(actual.displayName)
        })
        // TODO
        // it('generates hash for password', async () => {

        // })

    })
})