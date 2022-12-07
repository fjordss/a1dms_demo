"use strict"
{
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    let path = require('path');

    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    const TerserPlugin = require("terser-webpack-plugin");
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    const bundleFolder = "wwwroot/bundle/";

    module.exports = {
        //entry: "./wwwroot/ts/pages/CardApp.tsx",
        entry: "./wwwroot/ts/pages/mgmt/ManagementApp.tsx",
        optimization: {
            minimize: false,
            minimizer: [new TerserPlugin({
                terserOptions: { keep_classnames: true },
                parallel: true
            })]
        },
        resolve: {
            extensions: [".js", ".ts", ".tsx", ".css"]
        },
        output: {
            filename: 'managementBundle.js',
            //filename: 'cardBundle.js',
            path: path.resolve(__dirname, bundleFolder)
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'cache-loader',
                            options: {
                                cacheDirectory: path.resolve(
                                    __dirname,
                                    'node_modules/.cache/cache-loader'
                                ),
                            },
                        },
                        'ts-loader'
                    ],
                    //use: 'ts-loader',
                    exclude: '/node_modules/'
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                }
            ]
        },
        plugins: [
            //new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "managementBundle.css"
            }),
            new HtmlWebpackPlugin({
                title: 'Caching',
            }),
        ],
        devtool: "source-map"
    };
}