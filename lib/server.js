var fs = require("fs");
var path = require("path");
var httpolyglot = require("httpolyglot");
var express = require("express");
var webpack = require("webpack");
var webpackDevMiddleware = require("webpack-dev-middleware");
var omit = require("lodash.omit");

module.exports = function (webpackConfig, serverOpts) {
  var app = express();

  function useConfig(config) {
    var omittedKeys = ["devMiddleware"];
    var properWebpackConfig = omit(config, omittedKeys);
    var compiler = webpack(properWebpackConfig);

    app.use(webpackDevMiddleware(compiler, config.devMiddleware));
  }

  if (Array.isArray(webpackConfig)) {
    webpackConfig.forEach(useConfig);
  } else {
    useConfig(webpackConfig);
  }

  var host = serverOpts.host || "localhost";
  var port = serverOpts.port || 3001;
  httpolyglot
    .createServer(
      {
        key:
          serverOpts.key ||
          fs.readFileSync(path.join(__dirname, "../ssl/server.key")),
        cert:
          serverOpts.cert ||
          fs.readFileSync(path.join(__dirname, "../ssl/server.crt")),
        ca:
          serverOpts.cacert ||
          fs.readFileSync(path.join(__dirname, "../ssl/ca.crt"))
      },
      app
    )
    .listen(port, host, function () {
      if (serverOpts.noLog) return;
      console.log(
        "[webpack-httpolyglot-server]",
        "http(s)://" + host + ":" + port
      );
    });

  return app;
};
