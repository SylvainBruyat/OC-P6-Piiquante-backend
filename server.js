const HTTP = require('http');
const APP = require("./app");

APP.set("port", process.env.PORT || 3000);
const SERVER = HTTP.createServer(APP);

SERVER.listen(process.env.PORT || 3000);