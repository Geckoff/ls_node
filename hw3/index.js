const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
	session({
		secret: "vw",
		key: "loggedIn",
		cookie: {
			path: "/",
			httpOnly: true,
			maxAge: 10 * 60 * 1000,
		},
		saveUninitialized: false,
		resave: false,
	})
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));

const server = app.listen(4000, function () {
	console.log("Go to http://localhost:" + server.address().port);
});
