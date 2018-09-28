import {
    resolver,
    attributeFields,
    defaultArgs as attributesToArgs,
} from 'graphql-sequelize'
import assign from 'lodash/assign'
import { GraphQLObjectType } from 'graphql'
import { User } from '../../../data/models'
// Description is used twice in this file.
const description = 'Registered website user.'
/**
 * Graphql type representing a User object.
 * @export
 */
export const userType = new GraphQLObjectType({
    description,
    name: 'user',
    // Get fields from sequelize model.
    fields: assign(attributeFields(User, { commentToDescription: true }))
})
/**
 * This is a full query interface for a User.
 * @export
 */
export default {
    description,
    type: userType,
    resolve: resolver(User),
    // All of the models attributes are searchable fields.
    args: assign(attributesToArgs(User)),
}