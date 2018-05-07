import {
    GraphQLSchema,
    GraphQLObjectType,
} from 'graphql';
// import * as queries from './queries';
// import * as mutations from './mutations';
import user from './queries/user'
import viewer from './queries/viewer'
import forum from './queries/forum'
import forums from './queries/forums'
import mutations from './mutations'

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        description: 'Every graphql api must start from a root query point.\n This is it.',
        fields: () => ({
            user,
            viewer,
            forum,
            forums,
        }),
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        description: 'Every graphql api must start with a root mutation.',
        // fields: mutations
        fields: () => ({
            ...mutations
        }),
    }),
})

export default schema
