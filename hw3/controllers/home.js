const { getCountersByIds } = require("../db/counters");
const { getAllProducts } = require("../db/products");

const skills = [
	"Возраст начала занятий на скрипке",
	"Концертов отыграл",
	"Максимальное число городов в туре",
	"Лет на сцене в качестве скрипача",
];

const getCounters = () => getCountersByIds([1, 2, 3, 4]);

const getSkillsCounters = (counters) => {
	return counters.map((counter, i) => ({
		number: counter.value,
		text: skills[i],
	}));
};

const get = (req, res) => {
	const counters = getCounters();
	const products = getAllProducts();

	skillsCounters = getSkillsCounters(counters);

	res.render("pages/index", { skillsCounters, products });
};

module.exports = {
	get,
};
