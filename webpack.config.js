const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            },
            {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    plugins: [
        new CopyWebpackPlugin({ 
            patterns: [ 
             { from: './src/favicon.ico' },
             { from: './src/manifest.json' },
             { from: './src/BuiltWithSkynet.png' },
             { from: './src/impact.ttf' },
             { from: './node_modules/font-awesome/css/font-awesome.min.css' },
             { from: './node_modules/font-awesome/fonts', to: 'fonts/' }
            ]
        })
    ]
}