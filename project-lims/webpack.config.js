
var webpack = require('webpack');
var path = require('path');
var html = require('html-webpack-plugin')


module.exports = {

    entry: {
        bundle: './ui/index.js'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    optimization:{
        minimize: false
    },

    module: {
        rules: [
            {
                //test: /(?:t|j)s$/,
                //test: /(?:.[t|j]s)$/,
                test: /(?:.[tj]{1,}s)$/,
                //test: /(?:.[tj]s)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'ui', 'dist')
    },

    plugins: [
        //new html()
    ]

}