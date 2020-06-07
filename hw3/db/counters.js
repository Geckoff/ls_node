const { db, getDbDataError } = require("./dbConfig");
const Counter = require("../models/Counter");

const getCounterErr = "Counter does not exist";
const counters = db.get("counters");

const getCounterById = (id) => {
	const counter = counters.find({ id }).value();

	return counter ? new Counter(counter) : getDbError(getCounterErr);
};

const getCountersByIds = (ids) => {
	const result = counters.filter((counter) => ids.includes(counter.id)).value();

	return result.map((counter) => new Counter(counter));
};

updateCounterValue = (counter) => {
	counters.find({ id: counter.id }).assign({ value: counter.value }).write();
};

const updateCountersValue = (counters) => {
	let areModelsValid = true;

	const errMsg = counters.reduce((acc, counter) => {
		const { isValid, errMsg } = counter.validate();
		if (!isValid) {
			areModelsValid = false;
			return `${acc}${errMsg}`;
		}
		return acc;
	}, "");

	if (!areModelsValid) {
		return getDbDataError(errMsg);
	}

	counters.forEach((counter) => {
		updateCounterValue(counter);
	});

	return true;
};

module.exports = {
	getCounterById,
	updateCountersValue,
	getCountersByIds,
};
