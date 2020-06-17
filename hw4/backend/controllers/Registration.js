const User = require("../models/User");
const BaseController = require("./Base");
const { validatePasswordSchema } = require("../utils/validation");

class RegistrationController extends BaseController {
	postRegister = async (req, res) => {
		const { login, password, firstName, lastName, middleName } = req.body;

		if (!this.joiValidate(res, validatePasswordSchema, { password })) {
			return;
		}

		const user = new User({
			login,
			firstName,
			lastName,
			middleName,
		});

		user.setPassword(password);

		try {
			const saveResult = await user.save();
			const userId = saveResult._id;
			const {
				accessToken,
				refreshToken,
				accessTokenExpiredAt,
				refreshTokenExpiredAt,
			} = await this.tokens.getTokens({ id: userId });
			const newUser = await User.findById(userId);
			newUser.refreshToken = refreshToken;
			newUser.refreshTokenExpiredAt = refreshTokenExpiredAt;
			const newUserWithRefreshToken = await newUser.save();
			const fonrtAuthorizedUserObj = newUserWithRefreshToken.getFrontAuthorizedUserObject({
				accessToken,
				accessTokenExpiredAt,
			});
			this.respondWithData(fonrtAuthorizedUserObj, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};
}

module.exports = new RegistrationController();
