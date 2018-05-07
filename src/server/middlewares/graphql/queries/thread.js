import { GraphQLObjectType } from 'graphql'
import {
    resolver,
    attributeFields,
    defaultArgs as attributesToArgs,
} from 'graphql-sequelize'
import assign from 'lodash/assign'
import { Threads } from '../../../data/models'
// Description is used twice in this file.
const description = 'Thread is a collection of comments.'
/**
 * Graphql type representing a thread object.
 * @export
 */
export const threadType = new GraphQLObjectType({
    description,
    name: 'thread',
    // Get fields from sequelize model.
    fields: assign(attributeFields(Threads, { commentToDescription: true }))
})
/**
 * This is a full query interface for a Thread.
 * @export
 */
export default {
    description,
    type: threadType,
    resolve: resolver(Threads),
    // All of the model's attributes are searchable fields.
    args: assign(attributesToArgs(Threads)),
}