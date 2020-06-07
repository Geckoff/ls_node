const BaseModel = require("./Base");
const Validator = require("../validation/Validator");

class Counter extends BaseModel {
	constructor({ id, name, value, display }) {
		super(id);
		this.name = name;
		this.value = value;
		this.display = display;
		this.validator.addValidator(this.validateValue);
	}

	validateValue = () => {
		return Validator.isNumber(this.value, `${this.display} has to be a number. `);
	};
}

module.exports = Counter;
