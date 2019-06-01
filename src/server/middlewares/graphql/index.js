import {
    GraphQLSchema,
    GraphQLObjectType,
} from 'graphql';
import fs from 'fs'
import path from 'path'

const schema = new GraphQLSchema({
    /**
     * Queries.
     */
    query: new GraphQLObjectType({
        name: 'RootQuery',
        description: 'Every graphql api must start from a root query point.',
        // Dynamycally require all files from './queries' folder.
        fields: () => {
            let queries = {};
            fs
                .readdirSync(path.resolve(__dirname, '.', 'queries'))
                .forEach(file => {
                    queries[file.replace('.js', '')] = require(`./queries/${file}`).default
                })
            return queries;
        },

    }),
    /**
     * Mutations.
     */
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        description: 'Every graphql api must start with a root mutation.',
        // Dynamycally require all files from './mutations' folder.
        fields: () => {
            let mutations = {};
            fs
                .readdirSync(path.resolve(__dirname, '.', 'mutations'))
                .forEach(file => {
                    if (file.includes('test')) return

                    const mutationsFile = require(`./mutations/${file}`)
                    Object
                    .getOwnPropertyNames(mutationsFile)
                    .forEach(name => {
                        // Skip if name includes 'module'.
                        if (/\module/i.test(name)) return
                        else mutations[name] = mutationsFile[name]
                    })
                })
            return mutations;
        },
    }),
})

export default schema
