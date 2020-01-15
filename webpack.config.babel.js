import path
    from 'path';
import fs
    from 'fs';
import VueLoaderPlugin
    from 'vue-loader/lib/plugin';
import CopyPlugin
    from 'copy-webpack-plugin';
import webpack
    from 'webpack';
// import MiniCssExtractPlugin
//     from 'mini-css-extract-plugin'

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

entriesPoints['_external.css'] = require(__dirname + "/src/modules/**/*.scss");


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
    // externals: {
    //     jquery: 'jQuery',
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [path.join(__dirname, "/node_modules/")],
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.vue$/,
                exclude: path.join(__dirname, "/src/modules/"),
                loader: 'vue-loader',
                options: {
                    esModule: true
                }
            },
            // {
            //     test: /jquery.+\.js$/,
            //     use: [{
            //         loader: 'expose-loader',
            //         options: '$'
            //     }],
            //
            // },
            // Сборка стилей для vue
            {
                test: /\.scss$/,
                exclude: [path.join(__dirname, "/src/modules/"), path.join(__dirname, "/src/styles/")],
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
                exclude: [path.join(__dirname, "/src/vue/"), path.join(__dirname, "/src/styles/")],
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
            },
            // Сборка стилей для библиотек
            // {
            //     test: /\.(sa|sc|c)ss$/,
            //     exclude: [path.join(__dirname, "/src/modules/"), path.join(__dirname, "/src/vue/")],
            //     use: [
            //         {
            //             loader: MiniCssExtractPlugin.loader,
            //             options: {
            //                 hmr: process.env.NODE_ENV === 'development',
            //             },
            //         },
            //         'css-loader',
            //         'sass-loader',
            //         'postcss-loader',
            //     ],
            // },
            {
                test: /\.scss$/,
                exclude: [path.join(__dirname, "/src/modules/"), path.join(__dirname, "/src/vue/")],
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
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '../fonts',
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '../images',
                },
            },
        ],
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
                from: './src/scripts/external/jquery.js',
                to: '../js/'
            },
        ]),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // })
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: '[name].css',
        //     chunkFilename: '[id].css',
        // }),
    ]
};