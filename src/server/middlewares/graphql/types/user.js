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
import { User } from '../../../data/models'

const description = 'Registered website user.'

const userType = new GraphQLObjectType({
    description,
    name: 'user',
    // Get fields from sequelize model.
    fields: assign(attributeFields(User, { commentToDescription: true }))
})
/**
 * Graphql type representing a User object.
 * @export
 */
export { userType }
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