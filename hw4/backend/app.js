const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router/index");
const initIo = require("./websocket");
const http = require("http");
const socketIo = require("socket.io");

const cors = require("cors");
require("./db");

var app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/", router);

server.listen(3000, function () {
	console.log("Go to http://localhost:" + server.address().port);
});

initIo(io);
