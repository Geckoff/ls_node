const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
	created_at: {
		type: Number,
		required: true,
	},
	text: {
		type: String,
	},
	title: {
		type: String,
		required: [true, "Enter post name."],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
});

newsSchema.methods.getFrontNewsObject = function () {
	const newsObject = {
		id: this._id,
		created_at: this.created_at,
		text: this.text,
		title: this.title,
	};
	if (this.user) {
		newsObject.user = this.user.getFrontUserObject();
	}
	return newsObject;
};

const News = mongoose.model("news", newsSchema);

module.exports = News;
