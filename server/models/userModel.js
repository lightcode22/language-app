const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: false,
		unique: true,
		sparse: true,
		lowercase: true,
	},
	photo: String,
	role: {
		type: String,
		enum: ["user", "moderator", "admin"],
		default: "user",
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false,
	},
	registrationDate: {
		type: Date,
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	// по умолчанию это поле отсутствует, но добавляется или изменяется только при смене пароля
	// поэтому сначала нужно проверить на наличие поля в документе
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		// true - после выпуска токена пароль менялся
		// false - после выпуска токена пароль НЕ менялся
		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
