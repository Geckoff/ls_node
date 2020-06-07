const { homeRoute } = require("../routes/routes");
const url = require("url");
const Validator = require("../validation/Validator");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_API);

const emailSuccessMsg = "Email was sent";
const emailFailMsg = "Email was not sent, please, try again later";

const post = (req, res) => {
	const { name, email, message } = req.body;
	let msg = "";

	const { areValid, errMsg } = validateFormFields(name, email);

	if (!areValid) {
		msg = +errMsg;
		redirectHomeQuery(res, { msgemail: errMsg });
		return;
	}

	const objectToSend = {
		to: "ag-geck@yandex.ru",
		from: email,
		subject: `Message from ${name}`,
		text: message,
	};

	sgMail.send(objectToSend).then(
		(res) => {
			redirectHomeQuery(res, { msgemail: emailSuccessMsg });
		},
		(err) => {
			console.log(err);
			redirectHomeQuery(res, { msgemail: emailFailMsg });
		}
	);
};

const validateFormFields = (name, email) => {
	let areValid = true;
	let errMsg = "";

	const { isValidatorValid: isNameValid, errMsg: nameValidationMsg } = Validator.isNotEmpty(
		name,
		"Please, enter your name. "
	);

	if (!isNameValid) {
		areValid = false;
		errMsg += nameValidationMsg;
	}

	const { isValidatorValid: isEmailValid, errMsg: emailValidationMsg } = Validator.isEmail(email);

	if (!isEmailValid) {
		areValid = false;
		errMsg += emailValidationMsg;
	}

	return {
		areValid,
		errMsg,
	};
};

const redirectHomeQuery = (res, query) => {
	res.redirect(
		url.format({
			pathname: homeRoute,
			query,
		})
	);
};

module.exports = {
	post,
};
