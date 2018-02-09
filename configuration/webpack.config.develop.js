const path = require('path');
const webpack = require('webpack');
const WebpackConfig = require('webpack-config');

const Config = WebpackConfig.Config;

module.exports = function () {
    return new Config().extend('configuration/webpack.config.common.js').merge({

        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        failOnWarning: false,
                        failOnError: false,
                    },
                },
                {
                    test: /\.js$/,
                    use: ['source-map-loader'],
                    enforce: 'pre',
                },
                {
                    test: /\.less$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        'less-loader',
                    ],
                },
            ],
        },

        plugins: [
      /**
       * Allow doing hot swaps of modules as opposed to full refresh
       */
            new webpack.HotModuleReplacementPlugin(),
        ],

    /**
     * Development Server & Tools
     */
        devtool: 'eval',
        devServer: {
            contentBase: path.resolve('src', 'public', 'index.html'),
            port: 9000,
        },
    });
};
