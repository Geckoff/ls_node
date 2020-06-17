const { hasDbDataError } = require("../db/dbConfig");
const { getUserByEmail } = require("../db/users");
const { adminRoute } = require("../routes/routes");

const loginPasswordErr = "Incorrect Login or Password";

const get = (req, res) => {
	if (req.session.isLoggedIn) {
		res.redirect(adminRoute);
		return;
	}
	res.render("pages/login");
};

const post = (req, res) => {
	console.log(req.get("Content-Type"));
	const { email, password } = req.body;
	const user = getUserByEmail(email);

	if (hasDbDataError(user)) {
		res.render("pages/login", { msglogin: loginPasswordErr });
		return;
	}

	if (user.validatePassword(password)) {
		req.session.isLoggedIn = true;
		res.redirect(adminRoute);
	} else {
		res.render("pages/login", { msglogin: loginPasswordErr });
	}
};

module.exports = {
	get,
	post,
};
