"use strict";

var express = require("express"),
  app = express(),
  httpServer = require("http").createServer(app);

app.set("port", process.env.PORT || 8080);
app.use(express.static(__dirname + '/sandbox'))

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
};

/**
 * App Listen
 */
httpServer.listen(
  app.get("port"),
  app.get("ipaddr"),
  function () {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
  }
);