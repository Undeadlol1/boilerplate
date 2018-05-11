import UUID from 'uuid/v4'
import get from 'lodash/get'
import { expect } from 'chai'
import schema from '../index'
import Promise from 'bluebird'
import { graphql } from 'graphql'
import chai, { assert } from 'chai'
import server from '../../../server'
import randomstring from 'randomstring'
import { tester } from 'graphql-tester'
import { User, Forums } from '../../../data/models'
import { create } from 'graphql-tester/lib/main/servers/express'
chai.use(require('chai-properties'))
/**
 * Define UserId to create user object for tests
 * and to delete it after tests are done.
 */
const UserId = UUID()
// Administrator is a user with "id" == 1.
const admin = { id: 1 }
const forumNname = 'This is a test'
const payload = { name: forumNname }
const createForumQuery = `mutation {
    forum: createForum(name: "${payload.name}") {
        id
        name
        slug
        UserId
    }
}`
/**
 * Exectute request to create forum.
 * This function is an absctraction to make code cleaner.
 * @param {Object} user User which will be passed to context.
 * @param {string} name Mutation argument.
 * @returns {Promise} Graphql response.
 */
function createForumRequest(user, name = 'This is a test') {
    return graphql(
        schema,
        `mutation {
            forum: createForum(name: "${name}") {
                id
                name
                slug
                UserId
            }
        }`,
        null,
        { user }
    )
}

describe('Mutations:', () => {
    // TODO: do i need this?
    after(async () => {
        await User.destroy({where: {id: UserId}})
    })
    /**
     * Verify that "cretaeForum" works properly.
     */
    describe('createForum returns', () => {
        // Prevent unlogged users to create forums.
        it('error if user is not logged in.', async () => {
            // Run query and get results.
            const { data, errors } = await createForumRequest({})
            expect(data.forum).to.be.null
            expect(errors).to.have.length(1)
            expect(errors[0].message).to.equal('You must be logged in to do this.')
        })
        // Only administrators can create forums.
        it('error if user is not an admin.', async () => {
            // Run query with ordinary user in context.
            const { data, errors } = await createForumRequest({id: UserId})
            expect(data.forum).to.be.null
            expect(errors).to.have.length(1)
            expect(errors[0].message).to.equal('You must be an admin to do this.')
        })
        // Verify it returns created forum if everything is all right.
        it('created document.', async () => {
            // Run query and get results.
            const { data, errors } = await createForumRequest(admin)
            // Verify results.
            expect(errors).to.be.undefined
            // Make sure forum was inserted into database.
            const createdForum = await Forums.findOne({where: payload})
            expect(createdForum).to.be.a('object', 'forum should be created')
            expect(createdForum).to.have.properties(data.forum)
            // Make sure response has proper data.
            expect(data.forum).to.have.properties({
                UserId: 1,
                name: payload.name,
            })
        })
        /**
         * INPUT VALIDATION TESTS.
         */
        describe('error if', () => {
            // Run queries with different values and make sure there is a proper error message for it.
            it('argument validation failed', async () => {
                await Promise.each(
                    [
                        // Make sure duplicate forums cannot be created.
                        { value: forumNname, message: 'Forum already exists.' },
                        { value: undefined, message: 'Name is required.' },
                        { value: '', message: 'Name is required.' },
                        { value: ' ', message: 'Name is required.'},
                        // Make sure repeated whitespace is ignored.
                        { value: '  12    3    ', message: 'Name must be between 5 and 100 characters long.' },
                        { value: '123', message: 'Name must be between 5 and 100 characters long.' },
                        { value: randomstring.generate(101), message: 'Name must be between 5 and 100 characters long.' },
                    ],
                    async ({ value, message }) => {
                        const { errors, data } = await graphql(
                            schema,
                            `mutation {
                                forum: createForum(name: "${value}") {
                                    id
                                    name
                                    slug
                                    UserId
                                }
                            }`,
                            null,
                            { user: admin }
                        )
                        assert.isNull(data.forum, 'Forum was created.');
                        expect(errors[0].message).to.eq(message)
                    }
                )
            })
        })
        // TODO: what if forum with this name already exists?
    })
    /**
     * This tests were created when i was learning graphql.
     * WIP. They will be moved to appropriate files.
     */
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
        // it('example of a mutation', async () => {
        //     const user  = await User.create({id: 1})
        //     const query = `mutation {
        //         createForum(name: "${payload.name}") {
        //             id
        //             name
        //             slug
        //             UserId
        //         }
        //     }`
        //     const { data, errors } = await graphql(schema, query, null, {user})
        //     const createdForum  = await Forums.findOne({where: payload})
        //     assert.isUndefined(errors)
        //     expect(createdForum).to.be.a('object', 'forum should be created')
        //     expect(createdForum).to.have.properties(data.forum)
        // })
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