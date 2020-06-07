const { db, getDbDataError, generateId } = require("./dbConfig");

const products = db.get("products");

addProduct = (product) => {
	const { isValid, errMsg } = product.validate();

	if (!isValid) {
		return getDbDataError(errMsg);
	}
	product.id = generateId();
	products.push(product.getDataOnly()).write();

	return true;
};

getAllProducts = () => products.value();

module.exports = {
	addProduct,
	getAllProducts,
};
