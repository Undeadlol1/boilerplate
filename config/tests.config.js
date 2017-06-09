var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');
var nodeExternals = require('webpack-node-externals');
var path = require('path')
var commonConfig = require('./common.config.js')
var merge = require('webpack-merge');

var clientConfig =  merge(commonConfig, {
    // copy+paste from
    // https://semaphoreci.com/community/tutorials/testing-react-components-with-enzyme-and-mocha
    externals: {
        "jsdom": "window",
        "cheerio": "window",
        "react/lib/ReactContext": true,
        "react/lib/ExecutionEnvironment": true,
    },
    devtool: 'cheap-module-source-map',
    target: 'web',
    entry: [path.resolve('mocha!', __dirname, '../', 'src/browser/test/browser.tests.entry.js')],
    output : {
        publicPath: '/',
        filename: 'client.test.js',        
        path     : path.join(__dirname, '..', 'dist')        
    },
    // nodeExternals required for client because some modules throw errors otherwise
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/, 'react-router-transition/src/presets']
    })],
});

var serverConfig =   merge(commonConfig, {
    devtool: 'cheap-module-source-map',
    target: 'node',  
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/server/test/server.tests.entry.js')],
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
        new WebpackShellPlugin({
            onBuildEnd: "mocha dist/*.test.js --opts ./mocha.opts" //onBuildEnd //onBuildExit
        }),
    ],
    // this is important. Without nodeModules in "externals" bundle will throw and error
    // bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/, 'react-router-transition/src/presets']
    })],
});

module.exports = [clientConfig, serverConfig]