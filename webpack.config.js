"use strict";

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: path.resolve("./src"),
    entry: {
        "vendor": [ "leaflet", "leaflet-draw", "renderjson" ],
        "gt": [ "./gt/app/ApplicationController.js", "./gt/resource/index.less" ]
    },
    output: {
        path: path.resolve("./public/assets"),
        publicPath: "/assets/",
        filename: "[name]/index.js"
    },
    devServer: {
        contentBase: path.resolve("./public")
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    "ui5-loader?sourceRoot=./src",
                    "babel-loader?sourceRoot=./src&presets=ui5"
                ]
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./[name]/resource/index.css")
    ]
};
