import assign from 'lodash/assign'
import { GraphQLList } from 'graphql'
import { threadType } from './thread'
import { Threads } from '../../../data/models'
import { resolver, defaultListArgs } from 'graphql-sequelize'
/**
 * Queri interface for Threads.
 * @export
 */
export default {
    description: 'List of threads.',
    resolve: resolver(Threads),
    // Selector and pagination arguments.
    // https://github.com/mickhansen/graphql-sequelize#defaultlistargs
    args: assign(defaultListArgs()),
    type: new GraphQLList(threadType),
}