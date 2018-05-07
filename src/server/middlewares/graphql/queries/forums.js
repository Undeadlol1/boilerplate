import { GraphQLList } from 'graphql'
import assign from 'lodash/assign'
import { forumType } from './forum'
import { Forums } from '../../../data/models'
import {
    resolver,
    defaultListArgs,
} from 'graphql-sequelize'

export default {
    type: new GraphQLList(forumType),
    description: 'List of forums.',
    // Selector and pagination arguments.
    // https://github.com/mickhansen/graphql-sequelize#defaultlistargs
    args: assign(defaultListArgs()),
    resolve: resolver(Forums),
}