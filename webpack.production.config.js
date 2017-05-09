'use strict';
const APP = __dirname + '/app';
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const extractSASS = new ExtractTextPlugin('app.css');
const extractCSS = new ExtractTextPlugin('vendor.css');

module.exports = {
    context: APP,
    entry: {
           app: ['./core/app.js']
    },
    output: {
        path: __dirname + '/build',
        filename: "bundle-[hash].js",
        publicPath: process.env.NODE_ENV === "production" ? process.env.PRODUCTION_URL : process.env.STAGING_URL
    },
    module: {
        rules: [
            {
                test: /\.jade$/,
                loader: 'html-loader!jade-html-loader',
            },
            {
                test: /\.css$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [{loader: 'css-loader'}]
                })
            },
            {
                test: /\.scss$/,
                use: extractSASS.extract({
                    fallback: 'style-loader',
                    use: [{loader: 'css-loader'}, {loader: 'sass-loader'}]
                })
            },
            {
                test: /.*\.(gif|png|jpe?g)$/i,
                loader: 'file-loader'
            },
            {
                test: /\.(eot|ttf)$/,
                loader: 'url-loader?limit=100000000'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=100000000&mimetype=application/font-woff'
            },
            {
                test: /\.otf(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=100000000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg)((\?v=[0-9]\.[0-9]\.[0-9])|(\?#iefix))?$/,
                loader: 'url-loader?limit=100000000'
            },
            {
                test: /\.js$/,
                loader: 'ng-annotate-loader!babel-loader!eslint-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        extractCSS,
        extractSASS,
        new webpack.DefinePlugin({
            __API__: process.env.NODE_ENV === "production" ? JSON.stringify("https://admin.ensayapp.cl/api/") : JSON.stringify("https://ensayapp.herokuapp.com/api/"),
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/build/index.html'
        }),
        new webpack.optimize.UglifyJsPlugin(
            {
                compress: {
                    unused: true,
                    dead_code: true,
                    warnings: false,
                    screw_ie8: true
                }
            }
        )
    ]
};
