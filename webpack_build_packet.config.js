const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: ['./src/component/SkifTable.jsx'],
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
        ],
    },
    plugins: [
        new CopyPlugin([
            { from: './src/component/scss', to: 'scss' },
        ]),
    ],
};
