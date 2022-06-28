const path = require('path');

module.exports = {
    entry: './src/client/client.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'esbuild-loader',
                options: {
                    target: 'es2015'
                }
            }
        ]
    },
    resolve: {
        fallback: {
            "util": false,
            "fs": false,
            "path": false,
            "process": false
        },
        extensions: ['.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/client')
    }
}