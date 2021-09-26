const mongoose = require("mongoose");

const differenceSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Не указан заголовок"],
		unique: true,
		trim: true,
	},
	description: {
		type: String,
		default: "Описание отсутствует (пока...)",
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Difference = mongoose.model("Difference", differenceSchema);

module.exports = Difference;
