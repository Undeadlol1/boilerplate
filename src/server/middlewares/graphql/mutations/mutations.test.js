import { expect } from 'chai'
import server from '../../../server'
import GraphQL from 'express-graphql'
import { tester } from 'graphql-tester'
import { Forums } from '../../../data/models'
import { create } from 'graphql-tester/lib/main/servers/express'

describe('Express Server', () => {

    const ExpressTest = tester({
        url: '/graphql',
        server: create(server),
    });

    describe('Valid Query', () => {

        it('Returns success', async () => {
            const forum = await Forums.findOne({})
            expect(forum).to.be.a("object")
            const response = await ExpressTest(`{ forum(id: ${forum.id}) }`);
            console.log('forum.UserId: ', forum.UserId);
            console.log('response: ', response);
            expect(response).to.be.a("object")
            expect(response.data).to.be.a("object")
            // console.log('response: ', response);
            // return response.should.eventually.have.property('success').equal(true);
        });
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