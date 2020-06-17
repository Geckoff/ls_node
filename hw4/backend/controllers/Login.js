const BaseController = require("./Base");
const User = require("../models/User");

class LoginController extends BaseController {
	loginErr = "Login or password is incorrect";

	postLogin = async (req, res) => {
		const { login, password } = req.body;

		try {
			const user = await User.findOne({ login });

			if (!user || !password || !user.validatePassword(password)) {
				this.respondWithError({ message: this.loginErr }, res);
				return;
			}
			const {
				accessToken,
				refreshToken,
				accessTokenExpiredAt,
				refreshTokenExpiredAt,
			} = await this.tokens.getTokens({ id: user._id });
			const userWithUpdatedToken = await User.findOneAndUpdate(
				{ login },
				{ refreshToken, refreshTokenExpiredAt },
				{ new: true }
			);
			const fonrtAuthorizedUserObj = userWithUpdatedToken.getFrontAuthorizedUserObject({
				accessToken,
				accessTokenExpiredAt,
			});
			this.respondWithData(fonrtAuthorizedUserObj, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};
}

module.exports = new LoginController();
