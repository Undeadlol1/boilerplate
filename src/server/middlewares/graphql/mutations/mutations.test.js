import get from 'lodash/get'
import { expect } from 'chai'
import schema from '../index'
import { graphql } from 'graphql'
import chai, { assert } from 'chai'
import server from '../../../server'
import { tester } from 'graphql-tester'
import { User, Forums } from '../../../data/models'
import { create } from 'graphql-tester/lib/main/servers/express'
chai.use(require('chai-properties'))


const payload = { name: 'This is a test' }

describe('Express Server', () => {

    after(async () => {
        await User.destroy({where: {id: "1"}})
    })

    // const ExpressTest = tester({
    //     url: '/graphql',
    //     server: create(server),
    // });

    describe('Valid Query', () => {

        it('Returns success', async () => {
            // const forum = await Forums.findOne({})
            // expect(forum).to.be.a("object")
            // const response = await ExpressTest(`{ forum(id: ${forum.id}) }`);
            // console.log('forum.UserId: ', forum.UserId);
            // console.log('response: ', response);
            // expect(response).to.be.a("object")
            // expect(response.data).to.be.a("object")
            // console.log('response: ', response);
            // return response.should.eventually.have.property('success').equal(true);
        })
        it('tests the direct query via graphql', async () => {
            const forum = await Forums.findOne({})
            // Make sure reference document is found.
            expect(forum).to.be.a('object')
            const query = `{
                forum(where: {id: "${forum.id}"}) {
                    id
                    UserId
                }
            }`
            const { data } = await graphql(schema, query)
            expect(data.forum).to.have.property("id", forum.id);
        })
        it('example of a mutation', async () => {
            const user  = await User.create({id: 1})
            const query = `mutation {
                createForum(name: "${payload.name}") {
                    id
                    name
                    slug
                    UserId
                }
            }`
            const { data, errors } = await graphql(schema, query, null, {user})
            const createdForum  = await Forums.findOne({where: payload})
            assert.isUndefined(errors)
            expect(createdForum).to.be.a('object', 'forum should be created')
            expect(createdForum).to.have.properties(data.forum)
        })
        // it('Returns the correct Status code', () => {
        //     return response.should.eventually.have.property('status').equal(200);
        // });
        // it('Returns the correct name', () => {
        //     return response.should.eventually.have.deep.property('data.test').equal('Hello Graham');
        // });
    });

    // describe('Invalid Query', () => {
    //     const response = ExpressTest('{ somethingElse(who: "Graham") }');

    //     it('Returns success', () => {
    //         return response.should.eventually.have.property('success').equal(false);
    //     });
    //     it('Returns the correct Status code', () => {
    //         return response.should.eventually.have.property('status').equal(400);
    //     });
    //     it('Returns some errors', () => {
    //         return response.should.eventually.have.property('errors');
    //     });
    // });
});