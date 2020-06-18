const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new Schema({
	login: {
		type: String,
		required: [true, "Login is required."],
		minlength: [3, "Login has to be at least 3 characters long."],
		maxlength: [20, "Login has to be at most 20 characters long."],
		unique: true,
	},
	firstName: {
		type: String,
		min: 1,
		max: [100, "First name has to be at most 100 characters long."],
	},
	lastName: {
		type: String,
		min: 1,
		max: [100, "Last name has to be at most 100 characters long."],
	},
	middleName: {
		type: String,
		min: 1,
		max: [100, "Middle name has to be at most 100 characters long."],
	},
	salt: {
		type: String,
	},
	hash: {
		type: String,
	},
	refreshToken: {
		type: String,
	},
	refreshTokenExpiredAt: {
		type: Number,
	},
	permission: {
		chat: {
			C: {
				type: Boolean,
				default: true,
			},
			R: {
				type: Boolean,
				default: true,
			},
			U: {
				type: Boolean,
				default: true,
			},
			D: {
				type: Boolean,
				default: true,
			},
		},
		news: {
			C: {
				type: Boolean,
				default: true,
			},
			R: {
				type: Boolean,
				default: true,
			},
			U: {
				type: Boolean,
				default: true,
			},
			D: {
				type: Boolean,
				default: true,
			},
		},
		settings: {
			C: {
				type: Boolean,
				default: true,
			},
			R: {
				type: Boolean,
				default: true,
			},
			U: {
				type: Boolean,
				default: true,
			},
			D: {
				type: Boolean,
				default: true,
			},
		},
	},
});

userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
};

userSchema.methods.validatePassword = function (password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
	return hash === this.hash;
};

userSchema.methods.getFrontUserObject = function () {
	return {
		id: this._id,
		firstName: this.firstName,
		middleName: this.middleName,
		surName: this.lastName,
		username: this.login,
		image: undefined,
	};
};

userSchema.methods.getFrontUserObjectWithPermissions = function () {
	const frontUserObject = this.getFrontUserObject();
	return {
		...frontUserObject,
		permissions: {},
	};
};

userSchema.methods.getFrontAuthorizedUserObject = function ({ accessToken, accessTokenExpiredAt }) {
	const frontUserObject = this.getFrontUserObjectWithPermissions();
	return {
		...frontUserObject,
		refreshToken: this.refreshToken,
		refreshTokenExpiredAt: this.refreshTokenExpiredAt,
		accessToken,
		accessTokenExpiredAt,
	};
};

const User = mongoose.model("user", userSchema);

module.exports = User;
