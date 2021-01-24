const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    name: 'log-stylizer-webpack-plugin',
    entry: './src/log-stylizer-webpack-plugin.ts',
    output: {
        filename: 'logStylizerWebpackPlugin.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'LogStylizerWebpackPlugin',
        libraryTarget: 'umd'
    },
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
    ]
};