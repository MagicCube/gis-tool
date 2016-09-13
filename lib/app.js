import bodyParser from "body-parser";
import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

import api from "./api";

const app = express();
app.use(bodyParser());
app.get("/", (req, res) => {
    res.redirect("/gt");
});
app.use(express.static("public"));
app.use("/api", api);

const builderConfig = require("../webpack.config");
const builder = webpack(Object.assign({
    devtool: "cheap-module-source-map"
}, builderConfig));
app.use(webpackDevMiddleware(
    builder,
    {
        publicPath: builderConfig.output.publicPath
    }
));

export default app;
