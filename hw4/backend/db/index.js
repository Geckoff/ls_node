const mongoose = require("mongoose");

const dbUri = "mongodb://localhost:2717/hw5";

mongoose.Promise = global.Promise; // what does it do?
mongoose.set("useCreateIndex", true);
mongoose.connect(dbUri, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
	console.log(`Mongoose connection open ${dbUri}`);
});

mongoose.connection.on("error", (err) => {
	console.log("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
	console.log("Mongoose disconnected");
});

process.on("SIGINT", () => {
	mongoose.connection.close(() => {
		console.log("Mongoose connection disconnected app termination");
		process.exit(1);
	});
});
