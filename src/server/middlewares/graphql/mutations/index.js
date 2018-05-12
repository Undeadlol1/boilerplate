import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID,
} from 'graphql'
import pipe from 'ramda/src/pipe'
// TODO: add ramda-babel plugin
import compose from 'ramda/src/compose'
import chain from 'ramda/src/chain'
import useWith from 'ramda/src/useWith'
import prop from 'ramda/src/prop'
import isEmpty from 'ramda/src/isEmpty'
import slugify from 'slug'
import get from 'lodash/get'
import logger from 'debug-logger'
import assert from 'assert-plus'
import extend from 'lodash/assign'
import { logoutUser as logout } from '../../authApi'
import { userType } from '../queries/user'
import { forumType } from '../queries/forum'
import { Forums, Threads } from '../../../data/models'
import { threadType } from '../queries/thread'

const debug = logger('mutations')
/**
 * Check if exists and throw error if not.
 * This function is used in graphql resolvers.
 * @param {Object} user user object from request.
 */
function mustLogin(user) {
    if (isEmpty(user)) throw new Error('You must be logged in to do this.')
}
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
    async resolve(_, args, context) {
        try {
            // Debug logging.
            debug.info('createForum')
            debug('args', args)
            debug('user.id', context.user.id)
            // Prepare variables.
            const   UserId  = get(context, 'user.id'),
                    payload = extend(args, {
                        UserId,
                        slug: slugify(args.name),
                    })
            /**
             * Verify permissions.
             * User must be logged in and be an admin.
             */
            mustLogin(context && context.user)
            if (UserId !== process.env.ADMIN_ID) throw new Error('You must be an admin to do this.')
            // TODO: add tests for arguments.
            return await Forums.create(payload)
        } catch (err) {
            throw err.message
        }
    }
}
/**
 * Mutation which creates thread.
 * Thread is a container for a comments.
 * @export
 */
export const createThread = {
    type: threadType,
    description: 'Create a thread.',
    args: {
        parentId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        text: {
            type: new GraphQLNonNull(GraphQLString)
        },
    },
    resolve: async (_, args, {user}) => {
        try {
            // Debug logging.
            debug.info('resolve createThread')
            debug('args', args)
            debug('user.id', user && user.id)
            // Prepare variables.
            const payload = extend(args, {
                UserId: get(user, 'id'),
                slug: slugify(args.name),
            })
            // Verify permissions.
            // TODO: add tests for permissions.
            if (isEmpty(user)) throw new Error('You must be logged in to do this.')
            // Validate input.
            // TODO: add tests for arguments.
            if (!args.text || !args.name || !args.parentId) throw new Error('Missing arguments')
            // Create document and send it back.
            return await Threads.create(payload)
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