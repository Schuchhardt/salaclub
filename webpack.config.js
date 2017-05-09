'use strict';

const webpack = require('webpack');
const APP = __dirname + '/app';
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: APP,
    entry: {
       app: ['webpack/hot/dev-server', './core/app.js'],
    },
    output: {
      path: APP,
      filename: "bundle-[hash].js",
      publicPath: "http://localhost:8080/"
    },
    module: {
        rules: [
            {
                test: /\.jade$/,
                loader: 'html-loader!jade-html-loader',
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader',
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html'
      })
    ],
    devtool: 'source-map',
    devServer: {
      historyApiFallback: {
        index: 'index.html'
      },
      proxy: {
        // Proxy Backend
        '/api/*': {
          target: 'http://localhost:3000/',
          secure: false,
          changeOrigin: true,
          logLevel: 'debug',
        },
      },
    }
};
