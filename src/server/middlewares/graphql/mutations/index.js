import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID,
} from 'graphql'
import slugify from 'slug'
import get from 'lodash/get'
import logger from 'debug-logger'
import extend from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'
import { forumType } from '../queries/forum'
import { threadType } from '../queries/thread'
import condenseWhitespace from 'condense-whitespace'
import {
    logoutUser as logout,
} from '../../authApi'
import {
    Forums,
    Threads,
} from '../../../data/models'

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
    async resolve(_, args, {user}) {
        try {
            // Debug logging.
            debug.info('createForum')
            debug('args', args)
            debug('user.id', user && user.id)
            // Prepare variables.
            const   UserId  = get(user, 'id'),
                    // Remove repeated whitespace and trim.
                    name = condenseWhitespace(args.name),
                    payload = extend({name}, {
                        UserId,
                        slug: slugify(args.name),
                    })
            // Verify permissions.
            if (isEmpty(user)) throw new Error('You must be logged in to do this.')
            if (UserId !== process.env.ADMIN_ID) throw new Error('You must be an admin to do this.')
            // Validate values.
            if (!name || name == "undefined") throw new Error('Name is required.')
            if (name.length <= 4 || name.length >= 100) throw new Error('Name must be between 5 and 100 characters long.')
            // Make sure there will be no duplicates.
            if (await Forums.findOne({where: {name}})) throw new Error('Forum already exists.')
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