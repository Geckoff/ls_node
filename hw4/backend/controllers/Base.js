const tokens = require("../utils/Tokens");
const User = require("../models/User");

class BaseController {
	successStatus = "Success";
	failStatus = "Error";
	loginErrorMessage = "You have to be logged in";
	tokens = tokens;

	respondWithData = (result, res) => {
		res.json({
			status: this.successStatus,
			data: result,
		});
	};

	respondWithError = (err, res) => {
		const errMsg = this.composeErrorMessage(err);

		res.status(400).json({
			status: this.failStatus,
			message: errMsg,
		});
	};

	respondWithLoginError = (res) => {
		this.respondWithError({ message: this.loginErrorMessage }, res);
	};

	composeErrorMessage = (err) => {
		let errMsg = "";
		if (err && err.errors) {
			for (const errField in err.errors) {
				errMsg += `${err.errors[errField].properties.message} `;
			}
		} else if (err && err.message) {
			errMsg = err.message;
		} else {
			errMsg = "Request failed";
		}
		return errMsg;
	};

	joiValidate = (res, schema, obj) => {
		const valRes = schema.validate(obj);

		if (valRes.error) {
			this.respondWithError(valRes.error, res);
			return false;
		}

		return true;
	};

	getAuthorizedUserByToken = async (accessToken, res) => {
		if (!accessToken) {
			this.respondWithLoginError(res);
			return false;
		}

		try {
			const token = this.tokens.decodeToken(accessToken);
			if (token.exp * 1000 < Date.now()) {
				this.respondWithLoginError(res);
				return false;
			}
			const userId = token.user.id;
			const user = await User.findById(userId);

			if (!user) {
				this.respondWithLoginError(res);
				return false;
			}

			return user;
		} catch (err) {
			this.respondWithLoginError(res);
			return false;
		}
	};
}

module.exports = BaseController;
