const express = require("express");
const app = express();
const port = 3000;
const { INTERVAL, TIMEOUT } = process.env;

app.get("/startTimer", (_, response) => {
	const interval = setInterval(() => {
		console.log(new Date());
	}, INTERVAL || 500);

	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, TIMEOUT || 5000);
	}).then(() => {
		clearInterval(interval);
		response.send(new Date());
	});
});

app.listen(port, (err) => {
	if (err) {
		return console.log("Error: ", err);
	}
	console.log(`server is listening on ${port}`);
});
