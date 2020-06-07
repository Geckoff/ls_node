const BaseModel = require("./Base");
const Validator = require("../validation/Validator");

class Product extends BaseModel {
	constructor({ id, name, price, picture }) {
		super(id);
		this.name = name;
		this.price = price;
		this.picture = picture;
		this.validator.addValidators([
			this.validateName,
			this.validatePriceIsNumber,
			this.validatePriceNotEmpty,
		]);
	}

	getDataOnly = () => this.getDataOnlyBase(["name", "price", "picture"]);

	validateName = () => {
		return Validator.isNotEmpty(this.name, `Name cannot be empty. `);
	};

	validatePriceIsNumber = () => {
		return Validator.isNumber(this.price, `Price has to be a number. `);
	};

	validatePriceNotEmpty = () => {
		return Validator.isNotEmpty(this.price, `Price cannot be empty. `);
	};
}

module.exports = Product;
