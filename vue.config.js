module.exports = {
    productionSourceMap: false,
    publicPath: "./",
    devServer: {
        host: "0.0.0.0",
        port: 8080,
    },
    pages: {
        web: {
            entry: "web/test/main.js",
            template: "web/test/index.html",
        },
        webm: {
            entry: "webm/test/main.js",
            template: "webm/test/index.html",
        },
    },
};