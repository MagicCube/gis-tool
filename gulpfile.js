"use strict";

const babel = require("gulp-babel");
const gulp = require("gulp");
const gutil = require("gulp-util");
const rimraf = require("rimraf");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

gulp.task("default", [ "dist" ]);


gulp.task("clean", cb => {
    rimraf("./public/assets", cb);
});


gulp.task("dist", [ "clean", "dist-js" ], cb => {

});


gulp.task("dist-js", [ "clean" ], cb => {
    const sourceFiles = "./src/**/*.js";
    return gulp.src(sourceFiles)
               .pipe(babel({ sourceMaps: "inline" }))
               .pipe(gulp.dest("./public/assets/"));
});






gulp.task("dev", [ "clean" ], cb => {
    _startDevServer();
});

gulp.task("debug", [ "clean" ], cb => {
    _startWebpackDevServer({
        devtool: "cheap-module-source-map"
    });
});

function _startDevServer()
{
    
}

function _startWebpackDevServer(conf = {})
{
    const config = require("./webpack.config.js");
    Object.assign(config, conf);
    const compiler = webpack(config);
    new WebpackDevServer(compiler, {
        contentBase: "./public",
        publicPath: config.output.publicPath,
    }).listen(8080, "0.0.0.0", err => {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        const uri = "http://localhost:8080/";
        gutil.log("[webpack-dev-server]", uri);
    });
}
