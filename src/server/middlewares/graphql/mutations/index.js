import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
} from 'graphql'
import slugify from 'slug'
import get from 'lodash/get'
import logger from 'debug-logger'
import assert from 'assert-plus'
import extend from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'
import { logoutUser as logout } from '../../authApi'
import { userType } from '../queries/user'
import { forumType } from '../queries/forum'
import { Forums } from '../../../data/models'

const debug = logger('mutations')
/**
 * Mutation which reates forum.
 * Forum is a container for threads.
 * Only admins can create forums.
 * @export
 */
export const createForum = {
    type: forumType,
    description: 'Create a forum.',
    // Only "name" is ruquired to create forum.
    args: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
    },
    resolve: async (source, args, {user}) => {
        try {
            // Debug logging.
            debug('args', args)
            debug('source', source)
            debug('user && user.id', user && user.id)
            // Prepare variables.
            const UserId = get(user, 'id'),
                slug = slugify(args.name),
                payload = extend(args, {
                    UserId,
                    slug
                })
            // Verify permissions.
            // TODO: add tests for both permissions.
            // TODO: add tests for arguments.
            if (isEmpty(user)) throw new Error('You must be logged in to do this.')
            if (UserId !== process.env.ADMIN_ID) throw new Error('You must be an admin to do this.')
            return await Forums.create(payload)
        } catch (err) {
            throw err.message
        }
    },
}
/**
 * Logout current user mutation.
 * @export
 */
export const logoutUser = {
    type: GraphQLBoolean, // Return nothing.
    description: 'Logout current user.',
    resolve: (source, args, req) => logout(req),
}