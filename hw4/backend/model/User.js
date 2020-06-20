const UserDB = require("../models/User");
const crypto = require("crypto");

class User {
	defaultPermission = {
		chat: { C: false, R: false, U: false, D: false },
		news: { C: false, R: false, U: false, D: false },
		settings: { C: false, R: false, U: false, D: false },
	};

	constructor(propsDbModel) {
		this.id = propsDbModel._id;
		this.login = propsDbModel.login;
		this.firstName = propsDbModel.firstName;
		this.lastName = propsDbModel.lastName;
		this.middleName = propsDbModel.middleName;
		this.salt = propsDbModel.salt;
		this.hash = propsDbModel.hash;
		this.refreshToken = propsDbModel.refreshToken;
		this.refreshTokenExpiredAt = propsDbModel.refreshTokenExpiredAt;
		this.permission = propsDbModel.permission || this.defaultPermission;
		this.dbModel = propsDbModel._id ? propsDbModel : null;
	}

	save = async () => {
		if (!this.dbModel) {
			this.dbModel = new UserDB(this);
			await this.dbModel.save();
			this.id = this.dbModel.id;
		} else {
			this.dbModel.login = this.login;
			this.dbModel.firstName = this.firstName;
			this.dbModel.lastName = this.lastName;
			this.dbModel.middleName = this.middleName;
			this.dbModel.salt = this.salt;
			this.dbModel.hash = this.hash;
			this.dbModel.refreshToken = this.refreshToken;
			this.dbModel.refreshTokenExpiredAt = this.refreshTokenExpiredAt;
			this.dbModel.permission = this.permission;
			await this.dbModel.save();
		}
	};

	setPassword = (password) => {
		this.salt = crypto.randomBytes(16).toString("hex");
		this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
	};

	validatePassword = (password) => {
		const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
		return hash === this.hash;
	};

	getFrontUserObject = () => {
		return {
			id: this.id,
			firstName: this.firstName,
			middleName: this.middleName,
			surName: this.lastName,
			username: this.login,
			image: undefined,
		};
	};

	getFrontUserObjectWithPermissions = () => {
		const frontUserObject = this.getFrontUserObject();
		return {
			...frontUserObject,
			permission: this.permission,
		};
	};

	getFrontAuthorizedUserObject = ({ accessToken, accessTokenExpiredAt }) => {
		const frontUserObject = this.getFrontUserObjectWithPermissions();
		return {
			...frontUserObject,
			refreshToken: this.refreshToken,
			refreshTokenExpiredAt: this.refreshTokenExpiredAt,
			accessToken,
			accessTokenExpiredAt,
		};
	};
}

User.findById = async (id) => {
	const dbUser = await UserDB.findById(id);
	return new User(dbUser);
};

User.findByProps = async (props) => {
	const dbUser = await UserDB.findOne(props);
	return new User(dbUser);
};

User.findAll = async () => {
	const users = await UserDB.find();
	return users.map((user) => new User(user));
};

User.deleteById = async (id) => {
	const wasDeleted = await UserDB.findByIdAndRemove(id);
	return !!wasDeleted;
};

User.updateById = async (id, props) => {
	const dbUser = await UserDB.findByIdAndUpdate(id, props);
	return new User(dbUser);
};

User.updateByProps = async (propsToSearch, propsToUpdate) => {
	const dbUser = await UserDB.findOneAndUpdate(propsToSearch, propsToUpdate, { new: true });
	return new User(dbUser);
};

module.exports = User;
