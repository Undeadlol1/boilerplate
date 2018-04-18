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
        resolve: async (source, args, context, info) => {
            try {
                // TODO: only logged in users can create forums
                // TODO: only admins can create forums.
                throw new Error('penises')
                const payload = extend(args, {
                    UserId: context.user.id
                })
                return await Forums.create(payload)
            }
            catch (err) {
                throw err && err.message
            }
        }
    }
}