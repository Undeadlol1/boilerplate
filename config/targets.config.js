var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// TODO webpack-build-notifier (seems better tgeb webpack-notifier)
var merge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');
var extend = require('lodash/assignIn')
var commonConfig = require('./common.config.js')
var config = require('../config.js')
var CompressionPlugin = require('compression-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// TODO
// https://survivejs.com/webpack/optimizing/minifying/#enabling-a-performance-budget

const NODE_ENV = process.env.NODE_ENV
const isDevelopment = NODE_ENV === 'development'
const isProduction = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'

const serverVariables =  extend({
                            BROWSER: false,
                            isBrowser: false,
                            SERVER: true,
                            isServer: true,
                        }, config)

const clientVariables =  extend({
                            BROWSER: true,
                            isBrowser: true,
                            SERVER: false,
                            isServer: false,
                        }, config)

const clientProductionPlugins = isProduction ? [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
    // new webpack.optimize.DedupePlugin(), //dedupe similar code
    // TODO minify server
    // TODO try this https://github.com/webpack-contrib/uglifyjs-webpack-plugin
    new webpack.optimize.UglifyJsPlugin({minimize: true}), //minify everything
    new CompressionPlugin({//   <-- Add this
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.svg$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor.js',
    //     minChunks: Infinity, // <-- the way to avoid "webpackJsonp is not defined"
    // }),
] : []

const serverProductionPlugins = isProduction ? [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
    new webpack.optimize.UglifyJsPlugin({minimize: true}), //minify everything
] : []

const clientDevelopmentPlugins = isDevelopment ? [
                                    new BrowserSyncPlugin({
                                        open: false,
                                        proxy: {
                                            target: config.URL,
                                            cookies: { stripDomain: false }
                                        },
                                        // reload delay is needed to wait till webpack finishes compiling
                                        reloadDelay: 2000,
                                        // rest of config have not been tested carefully.
                                        // it's here for convenience, it's might be usefull
                                        watchOptions: {
                                            ignored: ['*'],
                                            ignoreInitial: true,
                                        },
                                        files: ['../dist/public/scripts.js']
                                    }),
                                ]
                                : []

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
        // libraryTarget: "commonjs",
    },
    plugins: [
        new webpack.EnvironmentPlugin(serverVariables),
        new CopyWebpackPlugin([{
            from: 'src/server/public',
            to: 'public'
        }]),
        ...serverProductionPlugins
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
        // 'vendor.js': ['react', 'redux', 'react-redux', 'redux-form', 'material-ui'], // TODO MAKE SURE TREE SHAKING WORKS HERE
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
        new webpack.EnvironmentPlugin(clientVariables),
        ...clientDevelopmentPlugins,
        ...clientProductionPlugins,
    ],
});

module.exports = [clientConfig, serverConfig,]
