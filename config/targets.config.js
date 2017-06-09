var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// TODO webpack-build-notifier (seems better tgeb webpack-notifier)
var merge = require('webpack-merge');
const BabiliPlugin = require('babili-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
var extend = require('lodash/assignIn')
var commonConfig = require('./common.config.js')

// TODO
// https://survivejs.com/webpack/optimizing/minifying/#enabling-a-performance-budget

const NODE_ENV = process.env.NODE_ENV
const isDevelopment = NODE_ENV === 'development'
const isProduction = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'

const serverVariables =  {
                            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                            BROWSER: false,
                            isBrowser: false,
                            SERVER: true,
                            isServer: true,
                        }
                        
const clientVariables =  {
                            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                            BROWSER: true,
                            isBrowser: true,
                            SERVER: false,
                            isServer: false,
                        }

const clientProductionPlugins = isDevelopment ? [] : [
    // new webpack.optimize.DedupePlugin(), //dedupe similar code 
    // new webpack.optimize.UglifyJsPlugin(), //minify everything
    new BabiliPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks 
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor.js',
    //     minChunks: Infinity, // <-- the way to avoid "webpackJsonp is not defined"
    // }),
]

var serverConfig = merge(commonConfig, {
    name: 'server',
    target: 'node',
    node: {
        __filename: true,
        __dirname: true 
    },
    entry  : ['babel-polyfill', './src/server/server.js'],
    output : {
        path     : path.join(__dirname, '..', 'dist'),
        filename : 'server.js',
        libraryTarget: "commonjs",
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': serverVariables
        }),
    ],
    // this is important. Without nodeModules in "externals" bundle will throw and error
    // bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/, 'react-router-transition/src/presets']
    })],
});

var clientConfig = merge(commonConfig, {
    name: 'client',
    target: 'web',
    entry  : {
        'vendor.js': ['react', 'redux', 'react-redux', 'redux-form', 'material-ui'], // TODO MAKE SURE TREE SHAKING WORKS HERE
        'scripts.js': './src/browser/App.jsx',
        // 'styles.css': './src/browser/styles.scss',
    },
    output : {
        publicPath: '/',
        filename : '[name]',
        path     : path.join(__dirname, '..', 'dist', 'public'),
    },
    plugins: [ // TODO MAKE SURE PLUGINS ARE ACTUALLY INCLUDED IN CONFIG
        // TODO this will be overriden in production!!!
        new webpack.DefinePlugin({
            'process.env': clientVariables,

        }),
        ...clientProductionPlugins
    ],
});

module.exports = [serverConfig, clientConfig]
 