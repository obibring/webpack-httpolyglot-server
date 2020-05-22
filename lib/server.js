var fs = require("fs");
var path = require("path");
var httpolyglot = require("httpolyglot");
var express = require("express");
var omit = require("lodash.omit");

module.exports = function (serverOpts) {
  var app = express();

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
        "[plater-httpolyglot-server]",
        "http(s)://" + host + ":" + port
      );
    });

  return app;
};
