const BaseController = require("./Base");
const News = require("../models/News");

class NewsController extends BaseController {
	postError = "Post not found";
	deleteError = "Nothing to delete";

	postNews = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const decodedToken = this.getDecodedTokenWithResponse(accessToken, res);
			const userId = decodedToken.user.id;
			const { title, text } = req.body;
			const news = await News.create({
				title,
				text,
				created_at: Date.now(),
				user: userId,
			});
			const savedNews = await news.save();
			this.respondWithData(savedNews, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	getNews = async (req, res) => {
		try {
			const news = await News.find().populate("user");
			const frontNewsObjects = news.map((post) => post.getFrontNewsObject());
			this.respondWithData(frontNewsObjects, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	getNewsById = async (req, res) => {
		try {
			const id = req.params.id;
			const frontNewsObjects = await this.fetchAllNews();
			this.respondWithData(frontNewsObjects, res);
		} catch (err) {
			this.respondWithError({ message: this.postError, err }, res);
		}
	};

	patchNewsById = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const id = req.params.id;
			const { text, title } = req.body;
			const news = await News.findById(id);
			news.text = text;
			news.title = title;
			await news.save();
			const frontNewsObjects = await this.fetchAllNews();
			this.respondWithData(frontNewsObjects, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	deletehNewsById = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const id = req.params.id;
			const deletedNews = await News.findByIdAndRemove(id);
			if (!deletedNews) {
				this.respondWithError({ message: this.deleteError }, res);
			}
			const frontNewsObjects = await this.fetchAllNews();
			this.respondWithData(frontNewsObjects, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	fetchAllNews = async () => {
		const allNews = await News.find().populate("user");
		const frontNewsObjects = allNews.map((post) => post.getFrontNewsObject());
		return frontNewsObjects;
	};
}

module.exports = new NewsController();
