class Validator {
	validators = [];

	addValidator = (validator) => {
		this.validators.push(validator);
	};

	addValidators = (validators) => {
		validators.forEach((validator) => {
			this.validators.push(validator);
		});
	};

	validate = () => {
		let isValid = true;
		const errMessage = this.validators.reduce((acc, validator) => {
			const { isValidatorValid, errMsg } = validator();

			if (!isValidatorValid) {
				isValid = false;
			}

			return errMsg ? `${acc}${errMsg}` : acc;
		}, "");

		return {
			isValid,
			errMsg: errMessage,
		};
	};
}

Validator.isNumber = (value, errMsg) => {
	//TODO bring in validation lib
	const isValidatorValid = !isNaN(value);
	const msg = !isValidatorValid ? errMsg || "Value has to be a number" : null;

	return {
		isValidatorValid,
		errMsg: msg,
	};
};

Validator.isNotEmpty = (value, errMsg) => {
	const isValidatorValid = value.length > 0;
	const msg = !isValidatorValid ? errMsg || "Value cannot be empty" : null;

	return {
		isValidatorValid,
		errMsg: msg,
	};
};

module.exports = Validator;
