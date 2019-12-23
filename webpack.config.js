const path = require("path");
const fs = require("fs");

let entriesPoints = {};
let entriesFolder = path.join(__dirname, "/src/modules/_imports"); // Папка файлов иморта

// Читаем имена файлов импорта
const entriesFiles = fs.readdirSync(entriesFolder);

// Создаем объект с точками входа
entriesFiles.map(item => {
    let entryName = item.split(".")[0];
    let entryPath = `${entriesFolder}/${entryName}.js`;
    entriesPoints[`${entryName}`] = entryPath;
});

module.exports = {
    entry: entriesPoints,
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