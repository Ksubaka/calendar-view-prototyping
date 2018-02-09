const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    INDEX_HTML: path.resolve('src', 'public', 'index.html'),
    APP: path.resolve('src', 'app'),
    DIST: path.resolve('dist'),
};

module.exports = {
    entry: {
        app: [
            path.resolve(PATHS.APP, 'app.js'),
        ],
    },

    output: {
        path: PATHS.DIST,
        filename: '[name].js',
        pathinfo: true,
    },

    resolve: {
        modules: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../node_modules'),
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                    plugins: ['syntax-dynamic-import'],
                },
            },
            {
                test: /\.html$/,
                exclude: PATHS.INDEX_HTML,
                use: [
                    {
                        loader: 'ngtemplate-loader',
                    },
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            conservativeCollapse: false,
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'file-loader?name=img/[name].[hash].[ext]',
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // exclude: /node_modules/,
                loader: 'file-loader?limit=1024&name=fonts/[name].[hash].[ext]',
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // exclude: /node_modules/,
                loader: 'file-loader?limit=1024&name=fonts/[name].[hash].[ext]',
            },
        ],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
        }),

      /**
       * Load the public index.html
       */
        new HtmlWebpackPlugin({
            template: PATHS.INDEX_HTML,
            inject: 'body',
        }),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
    ],

};
