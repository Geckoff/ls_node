const BaseModel = require("./Base");
const crypto = require("crypto");

class User extends BaseModel {
	constructor({ id, email, hash, salt }) {
		super(id);
		this.email = email;
		this.hash = hash;
		this.salt = salt;
	}

	validatePassword = (password) => {
		const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
		return hash === this.hash;
	};
}

module.exports = User;
