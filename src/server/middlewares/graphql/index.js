import {
    graphql,
    GraphQLSchema,
    GraphQLString,
    GraphQLObjectType,
} from 'graphql';
// import * as queries from './queries';
// import * as mutations from './mutations';
import forum from './types/forum'
import forums from './types/forums'

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        description: 'Every graphql api must start from a root query point.\n This is it.',
        fields: () => ({
            forum,
            forums,
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        description: 'Every graphql api must start with a root mutation.',
        // fields: mutations
        fields: () => ({
            forum,
            forums,
        })
    })
})

export default schema
