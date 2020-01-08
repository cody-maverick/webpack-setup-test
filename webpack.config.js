const path = require("path");
const fs = require("fs");
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // плагин для загрузки кода Vue

let entriesPoints = {};
let entriesFolder = path.join(__dirname, "/src/modules/_imports"); // Папка файлов иморта

// Читаем имена файлов импорта
const entriesFiles = fs.readdirSync(entriesFolder);

// Создаем объект с точками входа
entriesFiles.forEach(item => {
    let entryName = item.split(".")[0],
        entryPath = entryName === '_global' ? ['babel-polyfill', `${entriesFolder}/${item}`] : `${entriesFolder}/${item}`;
    entriesPoints[`${entryName}`] = entryPath;
});


// Добавляем точки vue
console.log(entriesPoints);
entriesPoints['vue'] = path.join(__dirname, "/src/vue/cabinet/index.js");
console.log(entriesPoints);

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
                test: /\.vue$/,
                exclude: path.join(__dirname, "/src/modules/"),
                loader: 'vue-loader',
                options: {
                    esModule: true
                }
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
            {
                test: /\.scss$/,
                exclude: path.join(__dirname, "/src/modules/"),
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new VueLoaderPlugin()
    ]
};