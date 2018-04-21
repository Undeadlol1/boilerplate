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
    attributeFields,
    defaultArgs as attributesToArgs,
} from 'graphql-sequelize'
import { userType } from './user'
import assign from 'lodash/assign'
import { User } from '../../../data/models'
/**
 * This is a full query interface for a logged in user.
 * @export
 */
export default {
    type: userType,
    resolve: (source, args, { user }) => user,
    description: 'Currently logged in user. (you)',
}