import {
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'
import slugify from 'slug'
import get from 'lodash/get'
import logger from 'debug-logger'
import assert from 'assert-plus'
import extend from 'lodash/assign'
import { forumType } from '../types/forum'
import { Forums } from '../../../data/models'

const debug = logger('mutations')

export default {
    createForum: {
        type: forumType,
        description: 'Create a forum.',
        args: {
            name: {
                type: new GraphQLNonNull(GraphQLString)
            },
        },
        resolve: async (source, args, { user }) => {
            try {
                debug('source', source)
                debug('args', args)
                debug('user && user.id', user && user.id)
                // Verify data.
                assert.object(user, "User")
                assert.string(args.name)
                // Prepare variables.
                const UserId = get(user, 'id')
                const slug = slugify(args.name)
                const payload = extend(args, {UserId, slug})
                // Verify permissions.
                // TODO: add tests for both permissions.
                // TODO: add tests for arguments.
                if (!user) throw new Error('You must be logged in to do this.')
                if (UserId !== process.env.ADMIN_ID) throw new Error('You must be an admin to do this.')
                return await Forums.create(payload)
            }
            catch (err) {
                throw err.message
            }
        },
    },
}