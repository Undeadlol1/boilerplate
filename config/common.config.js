var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var HappyPack = require('happypack');
var isTest = process.env.NODE_ENV === "test"
var isDevelopment = process.env.NODE_ENV === "development"
var isProduction = process.env.NODE_ENV === "production"

var extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    disable: isDevelopment // TODO
});

const developmentPlugins = isDevelopment || isTest ? [
    // new WebpackNotifierPlugin({alwaysNotify: false}),
    // new FriendlyErrorsWebpackPlugin(),
] : []

var stats = {
    hash: false,
    chunks: false,
    assets: false,
    modules: false,
    version: false,
    children: false,
    chunkModules: false,
    errorDetails: true,
    timings: false,
};

var baseConfig = {
    stats,
    context: path.resolve(__dirname, '../'),
    // https://webpack.js.org/configuration/devtool/
    devtool: isProduction ? 'hidden-source-map' : 'eval',
    watch: isDevelopment || isTest,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
    },
    // performance: {
    //     hints: "error"
    // },
    module : {
        loaders: [
            // ⚠️ BEWARE .json files caused infinite recompiling in the past!⚠️
            // {
            //     test: /\.json$/,
            //     use: 'json-loader'
            // },
            {
                test   : /.jsx?$/,
                loader : 'happypack/loader',
                // loader : 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.xml$/,
                loader: 'xml-loader'
            },
            {
                test: /\.(svg|png|ico)$/,
                loader: "file-loader"
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg|png|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules',
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        { loader: "css-loader", },
                        { loader: "sass-loader" }
                    ],
                    fallback: "style-loader"
                })
            },
        ],
    },
    plugins: [
        // new BundleAnalyzerPlugin({analyzerMode: 'static',}), // TODO do not include this in production
        new HappyPack({
            loaders: [ 'babel-loader' ],
            verbose: false,
        }),
        new ExtractTextPlugin({
            filename: "styles.css",
            disable: isDevelopment // TODO check if this works properly
        }),
        ...developmentPlugins
    ],
    resolve: {
        alias: {
            browser: path.join(__dirname, '/../', 'src/browser/'),
            server : path.join(__dirname, '/../', 'src/server/'),
            shared : path.join(__dirname, '/../', 'src/shared/'),
        },
        enforceModuleExtension: false,
        extensions: ['.js', '.jsx'],
    }
};

module.exports = baseConfig
