module.exports = {
    parser: 'postcss-safe-parser',
    plugins: {
        "postcss-inline-svg": {
            "paths": [
                "./src/icons"
            ]
        },
        "autoprefixer": {},
    }
}