import {
    graphql,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLUnionType,
    GraphQLObjectType,
} from 'graphql'
import {
    resolver,
    defaultArgs as attributesToArgs,
    attributeFields,
} from 'graphql-sequelize'
import assign from 'lodash/assign'
import { Forums } from '../../../data/models'

const forumType = new GraphQLObjectType({
    name: 'forum',
    description: 'Forum is a container for discussions.',
    fields: assign(attributeFields(Forums, { commentToDescription: true }))
    // fields: {
    //     id: {
    //         type: GraphQLID,
    //         description: 'Unique indentifier',
    //     },
    //     name: {
    //         type: GraphQLString,
    //     },
    //     slug: {
    //         type: GraphQLString,
    //         description: 'Url friendly text made of forum\'s name',
    //     },
    //     UserId: {
    //         type: GraphQLString,
    //     }
    // }
})
/**
 * Graphql type representing a forum object.
 * @export
 */
export { forumType }
/**
 * This is a full query interface for a Forum.
 * @export
 */
export default {
    type: forumType,
    description: 'Forum is a container for threads.',
    args: assign(attributesToArgs(Forums)),
    resolve: resolver(Forums)
}