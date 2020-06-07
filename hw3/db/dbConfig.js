const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const adapter = new FileSync(path.join(__dirname, "db.json"));

const db = low(adapter);

const getDbDataError = (errorMsg) => ({
	dbDataError: errorMsg,
});

const hasDbDataError = (result) => {
	return typeof result !== "undefined" && typeof result.dbDataError !== "undefined";
};

const generateId = () => Math.round(Math.random() * 100000000000000);

module.exports = {
	db,
	getDbDataError,
	hasDbDataError,
	generateId,
};
