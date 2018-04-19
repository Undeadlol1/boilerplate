import {
    graphql,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLUnionType,
    GraphQLObjectType,
    GraphQLInputObjectType
} from 'graphql'
import assert from 'assert-plus'
import { forumType } from '../types/forum'
import { Forums } from '../../../data/models'

export default {
    createForum: {
        type: forumType,
        description: 'Create a forum.',
        args: {
            name: {
                type: new GraphQLNonNull(GraphQLString)
            },
        },
        resolve: async (source, args, {user}, info) => {
            try {
                assert.object(user, "User")
                assert.string(args.name)
                // TODO: only logged in users can create forums
                // TODO: only admins can create forums.
                if (!user) throw new Error('You must be logged in to do this.')
                if (user.id !== process.env.ADMIN_ID) throw new Error('You must be an admin to do this.')
                const payload = extend(args, {
                    UserId: context.user.id
                })
                return await Forums.create(payload)
            }
            catch (err) {
                throw err.message
            }
        }
    }
}