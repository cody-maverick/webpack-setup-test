const path = require("path");

module.exports = {
    entry: {
        global: './src/modules/global.js',
        cart: './src/modules/cart.js',
        catalog: './src/modules/catalog.js'
    },
    output: {
        path: path.join(__dirname, "/public"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader' // compiles Less to CSS
                }]
            },
        ]
    },
    // devtool: 'inline-source-map'
};