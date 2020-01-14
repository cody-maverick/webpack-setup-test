import path
    from 'path';
import fs
    from 'fs';
import VueLoaderPlugin
    from 'vue-loader/lib/plugin';
import CopyPlugin
    from 'copy-webpack-plugin';

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

// Точки входа модулей + Точки входа vue
entriesPoints = Object.assign(entriesPoints, vueEntriesPoints);

//Добавляем точку входа для библиотек
entriesPoints['_external'] = path.join(__dirname, "/src/scripts/imports.js");


const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const IS_DEV = ENV === 'development';
console.log(`${ENV} сборка`);

module.exports = {
    mode: ENV,
    entry: entriesPoints,
    output: {
        path: path.join(__dirname, "/build/js"),
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
        new VueLoaderPlugin(),
        new CopyPlugin([
            {
                from: './src/icons',
                to: '../icons'
            },
            {
                from: './src/fonts',
                to: '../fonts/'
            },
            {
                from: './src/images',
                to: '../images'
            }
        ])
    ]
};