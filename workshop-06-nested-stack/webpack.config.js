//var ZipPlugin = require('zip-webpack-plugin');
const path = require('path');
const SRC_DIR = path.resolve(__dirname, 'src');
const OUT_DIR = path.resolve(__dirname, 'deployment');
module.exports = {
    entry: {
        cdkLambdaFunction: path.resolve(SRC_DIR, 'cdkLambdaFunction.js'),
        cdkFifoLambdaFunction: path.resolve(SRC_DIR, 'cdkFifoLambdaFunction.js'),
        cdkDynamoDBLambdaFunction: path.resolve(SRC_DIR, 'cdkDynamoDBLambdaFunction.js')
    },
    // aws-sdk is already available in the Node.js Lambda environment
    //  so it can be excluded from function bundles
    //externals: [
    //    'aws-sdk'
    //],
    output: {
        path: OUT_DIR,
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    target: 'node',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: { node: '12.11' }, // Node version on AWS Lambda
                                modules: false // See https://babeljs.io/docs/plugins/preset-env/#optionsmodules
                            }],
                        ],
                    }
                }
            }
        ]
    }
};