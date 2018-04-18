import {
    graphql,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLUnionType,
    GraphQLObjectType,
    GraphQLList
} from 'graphql'
import assign from 'lodash/assign'
import { forumType } from './forum'
import { Forums } from '../../../data/models'
import {
    resolver,
    defaultListArgs,
} from 'graphql-sequelize'

// const forumsType = new GraphQLObjectType({
//     name: 'forums',
//     description: 'List of forums.',
//     fields: {
//         values: {
//             type: new GraphQLList(forumType)
//         },
//     }
// })
/**
 * This is a full query interface for a Forums.
 */
export default {
    type: new GraphQLList(forumType),
    description: 'List of forums.',
    // Selector and pagination arguments.
    // https://github.com/mickhansen/graphql-sequelize#defaultlistargs
    args: assign(defaultListArgs()),
    resolve: resolver(Forums),
}