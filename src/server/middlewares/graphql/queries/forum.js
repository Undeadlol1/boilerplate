import { GraphQLObjectType } from 'graphql'
import {
    resolver,
    attributeFields,
    defaultArgs as attributesToArgs,
} from 'graphql-sequelize'
import assign from 'lodash/assign'
import { Forums } from '../../../data/models'

const forumType = new GraphQLObjectType({
    name: 'forum',
    description: 'Forum is a container for threads.',
    // Get fields from sequelize model.
    fields: assign(attributeFields(Forums, { commentToDescription: true }))
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
    resolve: resolver(Forums),
    // All of the models attributes are searchable fields.
    args: assign(attributesToArgs(Forums)),
    description: 'Forum is a container for threads.',
}