try {
    var node_env = process.env.NODE_ENV
    // use "development" config if nothing is specified
    if (!node_env) node_env = 'development'
    var config = require('./' + node_env + '.json')
    // check if config has same keys as development one
    Object
        .keys(require('./development.json'))
        .forEach(function(key) {
            if(!config.hasOwnProperty(key)) throw new Error(
                '\nDevelopment config have key which doesn\'t exists in '
                + node_env + '.'
                + '\nDid you forget to add "' + key + '" to '
                + node_env + '.json?'
            )
        })
}
catch (error) {
    console.error('Something went wrong during loading of configuration file!')
    throw new Error(error)
}

module.exports = config