const { db, getDbDataError } = require("./dbConfig");
const User = require("../models/User");

const getUserErr = "User does not exist";
const users = db.get("users");

const getUserByEmail = (email) => {
	const user = users.find({ email }).value();

	return user ? new User(user) : getDbDataError(getUserErr);
};

module.exports = {
	getUserByEmail,
};
