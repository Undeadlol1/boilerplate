import {
    GraphQLSchema,
    GraphQLObjectType,
} from 'graphql';
import user from './queries/user'
import viewer from './queries/viewer'
import forum from './queries/forum'
import forums from './queries/forums'
import thread from './queries/thread'
import threads from './queries/threads'
import * as mutations from './mutations'

const schema = new GraphQLSchema({
    /**
     * Queries.
     */
    query: new GraphQLObjectType({
        name: 'RootQuery',
        description: 'Every graphql api must start from a root query point.',
        fields: () => ({
            user,
            viewer,
            forum,
            forums,
            thread,
            threads,
        }),
    }),
    /**
     * Mutations.
     */
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        description: 'Every graphql api must start with a root mutation.',
        // fields: mutations
        fields: () => ({...mutations}),
    }),
})

export default schema
