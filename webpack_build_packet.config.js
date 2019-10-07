const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/component/SkifTable.js',
    output: {
        path: path.resolve('lib'),
        filename: 'SkifTable.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                }),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        // if you want to pass in options, you can do so:
        // new ExtractTextPlugin({
        //  filename: 'style.css'
        // })
    ],
};
