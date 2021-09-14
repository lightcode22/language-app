const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
	tokenId: {
		type: String,
		required: true,
		unique: true,
	},
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
