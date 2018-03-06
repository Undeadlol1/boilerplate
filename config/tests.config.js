var path = require('path')
var webpack = require('webpack')
var hasFlag = require('has-flag')
var merge = require('webpack-merge')
var extend = require('lodash/assignIn')
var nodeExternals = require('webpack-node-externals')
var WebpackShellPlugin = require('webpack-shell-plugin')

var appVariables = require('../config.js')
var commonConfig = require('./common.config.js')

const serverVariables = extend({
    BROWSER: false,
    isBrowser: false,
    SERVER: true,
    isServer: true,
}, appVariables)

const clientVariables = extend({
    BROWSER: true,
    isBrowser: true,
    SERVER: false,
    isServer: false,
}, appVariables)

var clientConfig = merge(commonConfig, {
    // copy+paste from
    // https://semaphoreci.com/community/tutorials/testing-react-components-with-enzyme-and-mocha
    externals: {
        "jsdom": "window",
        "cheerio": "window",
        "react/addons": 'react',
        "react/lib/ReactContext": 'react',
        "react/lib/ExecutionEnvironment": 'react',
    },
    target: 'web',
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/browser/browser.tests.entry.js')],
    output : {
        publicPath: '/',
        filename: 'client.test.js',
        path     : path.join(__dirname, '..', 'dist')
    },
    plugins: [
        new webpack.EnvironmentPlugin(clientVariables),
        new WebpackShellPlugin({
            // if "watch" argument is passed use mocha with config file
            // else just run tests and exit
            // TODO: use this for cli arguments
            // https://www.npmjs.com/package/command-line-args
            onBuildEnd: hasFlag('w') || hasFlag('watch')
                        ? "mocha dist/*.test.js --opts ./mocha.opts"
                        : "mocha dist/*.test.js"
        }),
    ],
    // nodeExternals required for client because some modules throw errors otherwise
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/]
    })],
});

var serverConfig = merge(commonConfig, {
    target: 'node',
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/server/server.tests.entry.js')],
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        filename: 'server.test.js',
        path     : path.join(__dirname, '..', 'dist'),
        libraryTarget: "commonjs", // ????
    },
    plugins: [
        new webpack.EnvironmentPlugin(serverVariables),
    ],
    // this is important. Without nodeModules in "externals" bundle will throw and error
    // bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/]
    })],
});

/*
    heads up! This is a brainless copypaste
    refactoring may be done
 */
var coreConfig = merge(commonConfig, {
    target: 'node',
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'core/core.tests.entry.js')],
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        filename: 'core.test.js',
        path     : path.join(__dirname, '..', 'dist'),
        libraryTarget: "commonjs", // ????
    },
    plugins: [
        new webpack.EnvironmentPlugin(serverVariables),
    ],
    // this is important. Without nodeModules in "externals" bundle will throw and error
    // bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/]
    })],
});

module.exports = [clientConfig, serverConfig, coreConfig]