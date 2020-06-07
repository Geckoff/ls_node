const Validator = require("../validation/Validator");

class BaseModel {
	constructor(id) {
		this.id = id;
		this.isNew = this.id === undefined;
		this.validator = new Validator();
	}

	validate = () => {
		return this.validator.validate();
	};

	getDataOnlyBase = (fields) => {
		const dataOnly = { id: this.id };
		return fields.reduce((acc, field) => {
			acc[field] = this[field];
			return acc;
		}, dataOnly);
	};
}

module.exports = BaseModel;
