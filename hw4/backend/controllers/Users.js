const User = require("../models/User");
const BaseController = require("./Base");

class UsersController extends BaseController {
	deleteError = "User doesn't exist";

	getUsers = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const users = await User.find();
			const usersFrontObject = users.map((user) => user.getFrontUserObjectWithPermissions());
			this.respondWithData(usersFrontObject, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	deleteUser = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const id = req.params.id;
			const deleteddUser = await User.findByIdAndRemove(id);
			if (!deleteddUser) {
				this.respondWithError({ message: this.deleteError }, res);
			}
			this.respondWithData(true, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	patchUserPermission = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		// const permission = {
		// 	chat: { C: false, R: false, U: false, D: false },
		// 	news: { C: false, R: false, U: false, D: false },
		// 	settings: { C: false, R: false, U: false, D: false },
		// };

		try {
			const id = req.params.id;
			const { permission } = req.body;
			await User.findByIdAndUpdate(id, { permission });
			this.respondWithData(true, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};
}

module.exports = new UsersController();
