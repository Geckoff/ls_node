const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router/index");
const cors = require("cors");
require("./db");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/", router);

const server = app.listen(3000, function () {
	console.log("Go to http://localhost:" + server.address().port);
});
