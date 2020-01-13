const path = require("path");
const fs = require('fs');
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // плагин для загрузки кода Vue
const CopyPlugin = require('copy-webpack-plugin');

let entriesPoints = {}; // Объект точек входа
let entriesFolder = path.join(__dirname, "/src/modules/_imports"); // Папка файлов иморта

// Читаем имена файлов импорта
const entriesFiles = fs.readdirSync(entriesFolder);

// Создаем объект с точками входа
entriesFiles.forEach(item => {
    let entryName = item.split(".")[0],
        entryPath = entryName === '_global' ? ['babel-polyfill', `${entriesFolder}/${item}`] : `${entriesFolder}/${item}`;
    entriesPoints[`${entryName}`] = entryPath;
});

// Добавляем точки входа vue модулей
let vueEntriesPoints = {};
let vueEntriesFolder = path.join(__dirname, "/src/vue"); // Папка модулей vue

let vueModules = fs.readdirSync(vueEntriesFolder); // Читаем папку модулей vue
vueModules.forEach(item => {
    let vueModuleItem = `${vueEntriesFolder}/${item}`;
    vueEntriesPoints[`vue.${item}`] = `${vueModuleItem}/index.js`;
})

// Итоговые точки входа
entriesPoints = Object.assign(entriesPoints, vueEntriesPoints);

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const IS_DEV = ENV === 'development';
console.log(ENV);

module.exports = {
    mode: ENV,
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
            // Сборка стилей для vue
            {
                test: /\.scss$/,
                exclude: path.join(__dirname, "/src/modules/"),
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: IS_DEV,
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            // Сборка стилей для js модулей
            {
                test: /\.scss$/,
                exclude: path.join(__dirname, "/src/vue/"),
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: IS_DEV,
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    devtool: IS_DEV === true ? 'source-map' : false,
    plugins: [
        new VueLoaderPlugin()
    ],
    // watch: IS_DEV
};