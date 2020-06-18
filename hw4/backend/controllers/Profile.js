const BaseController = require("./Base");
const { validatePasswordSchema } = require("../utils/validation");
const User = require("../models/User");

class ProfileController extends BaseController {
	missingPasswordError = "Current password missing";
	wrongPasswordError = "Incorrect pasword";

	getProfile = async (req, res) => {
		const accessToken = req.headers.authorization;
		try {
			const user = await this.getAuthorizedUserByTokenWithResponse(accessToken, res);
			if (!user) {
				return;
			}
			const frontUserObject = user.getFrontUserObjectWithPermissions();
			this.respondWithData(frontUserObject, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	patchProfile = async (req, res) => {
		const accessToken = req.headers.authorization;
		const user = await this.getAuthorizedUserByTokenWithResponse(accessToken, res);
		if (!user) {
			return;
		}
		this.applyInfoUpdates(req.body, user);
		const arePasswordUpdatesValid = this.applyPasswordUpdates(req.body, user, res);
		if (!arePasswordUpdatesValid) {
			return;
		}
		try {
			const userWithUpdatedData = await user.save();
			const frontUserObject = userWithUpdatedData.getFrontUserObjectWithPermissions();
			this.respondWithData(frontUserObject, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	applyInfoUpdates = (body, user) => {
		const { firstName, middleName, surName, avatar } = body;
		user.firstName = firstName !== undefined ? firstName : user.firstName;
		user.lastName = surName !== undefined ? surName : user.lastName;
		user.middleName = middleName !== undefined ? middleName : user.middleName;
	};

	applyPasswordUpdates = (body, user, res) => {
		const { oldPassword, newPassword } = body;
		if (!oldPassword && !newPassword) {
			return true;
		}
		if (newPassword && !oldPassword) {
			this.respondWithError({ message: missingPasswordError }, res);
			return false;
		}
		if (!this.joiValidate(res, validatePasswordSchema, { password: newPassword })) {
			return false;
		}
		if (!user.validatePassword(oldPassword)) {
			this.respondWithError({ message: this.wrongPasswordError }, res);
			return false;
		}
		user.setPassword(newPassword);
		return true;
	};

	getAuthorizedUserByTokenWithResponse = async (accessToken, res) => {
		const user = await this.getAuthorizedUserByToken(accessToken);
		if (!user) {
			this.respondWithLoginError(res);
		}
		return user;
	};

	getAuthorizedUserByToken = async (accessToken) => {
		if (!accessToken) {
			return false;
		}

		try {
			const token = this.tokens.getDecodedValidToken(accessToken);
			if (!token) {
				return false;
			}
			const userId = token.user.id;
			const user = await User.findById(userId);

			if (!user) {
				return false;
			}

			return user;
		} catch (err) {
			this.respondWithError(err, res);
			return false;
		}
	};
}

module.exports = new ProfileController();
