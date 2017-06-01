var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var webpackConfig = {
    output:{
        filename : '[name].min.js'
    },

    devtool: 'sourcemap',

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app','vendor', 'polyfills']
        }),
        new UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
      })
    ]
};


module.exports = webpackConfig;
