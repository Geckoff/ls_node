const { loginRoute } = require("../routes/routes");
const { getCountersByIds, updateCountersValue } = require("../db/counters");
const { adminRoute } = require("../routes/routes");
const { hasDbDataError } = require("../db/dbConfig");
const url = require("url");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { addProduct } = require("../db/products");
const Product = require("../models/Product");

let counters = [];
const countersSuccessMsg = "Counters were updated successfully";
const noCountersMsg = "No changes to save";
const productSuccessMsg = "Product was added successfully";

const get = (req, res) => {
	if (!req.session.isLoggedIn) {
		res.redirect(loginRoute);
		return;
	}

	const { msgSkills, msgProduct } = req.query;
	counters = getCounters();

	res.render("pages/admin", { counters, msgskill: msgSkills, msgproduct: msgProduct });
};

const getCounters = () => getCountersByIds([1, 2, 3, 4]);

const skillsPost = (req, res) => {
	const countersToUpdate = [];
	let notificationMsg = "";

	for (const param in req.body) {
		const counter = counters.find((counter) => {
			return counter.name === param;
		});
		if (counter.value.toString() !== req.body[param].toString()) {
			counter.value = req.body[param];
			countersToUpdate.push(counter);
		}
	}

	if (countersToUpdate.length === 0) {
		notificationMsg = noCountersMsg;
	} else {
		const updateResult = updateCountersValue(countersToUpdate);

		notificationMsg = hasDbDataError(updateResult)
			? updateResult.dbDataError
			: countersSuccessMsg;
	}

	redirectAdminQuery(res, {
		msgSkills: notificationMsg,
	});
};

const uploadPost = (req, res) => {
	const form = new formidable.IncomingForm();
	const uploadsDir = path.join("public", "uploads");
	let notificationMsg = "";

	form.uploadDir = path.join(process.cwd(), uploadsDir);

	form.parse(req, function (err, fields, files) {
		console.log(fields);
		let fileName = path.join(uploadsDir, files.photo.name);

		const nonDuplicateFileName = avoidFileNameDuplicates(fileName);

		console.log(uploadsDir, nonDuplicateFileName, files.photo.path);

		fs.rename(files.photo.path, nonDuplicateFileName, function (err) {
			if (err) {
				console.error(err.message);
				return;
			}

			const productToAdd = new Product({
				name: fields.name,
				price: fields.price,
				picture: getPictureUrl(nonDuplicateFileName),
			});

			const addResult = addProduct(productToAdd);

			if (hasDbDataError(addResult)) {
				fs.unlinkSync(nonDuplicateFileName);
				notificationMsg = addResult.dbDataError;
			} else {
				notificationMsg = productSuccessMsg;
			}

			redirectAdminQuery(res, {
				msgProduct: notificationMsg,
			});
		});
	});
};

const avoidFileNameDuplicates = (fileName) => {
	if (fs.existsSync(fileName)) {
		fileNameArray = fileName.split(".");
		fileNameArray[fileNameArray.length - 2] = fileNameArray[fileNameArray.length - 2] + "1";
		const updatedName = fileNameArray.join(".");
		return avoidFileNameDuplicates(updatedName);
	}
	return fileName;
};

const redirectAdminQuery = (res, query) => {
	res.redirect(
		url.format({
			pathname: adminRoute,
			query,
		})
	);
};

getPictureUrl = (filePath) => {
	const filePathArr = filePath.split(path.sep);
	const fileName = filePathArr[filePathArr.length - 1];
	return "uploads/" + fileName;
};

module.exports = {
	get,
	skillsPost,
	uploadPost,
};
