/*jslint node:true*/

var webpack = require('webpack');

module.exports = {
    entry: {
        app: ['webpack/hot/dev-server']
    },
    output: {
        path: './',
        filename: "bundle.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
          // the url-loader uses DataUrls. 
          // the file-loader emits files. 
          { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
          { test: /\.ttf$/,    loader: "file-loader" },
          { test: /\.eot$/,    loader: "file-loader" },
          { test: /\.svg$/,    loader: "file-loader" }
        ]
    }
        
};