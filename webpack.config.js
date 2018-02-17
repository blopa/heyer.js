var path = require('path');

var SRC_DIR = path.resolve(__dirname, 'src');
var DIST_DIR = path.resolve(__dirname, 'dist');

var config = {
    entry: SRC_DIR + '/index.js',
    output: {
        path: DIST_DIR + '/',
        filename: 'heyer.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = config;