const Token = require("../models/tokenModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const createAccessToken = (userId) => {
	const payload = { userId };
	const options = { expiresIn: process.env.JWT_EXPIRES_IN };

	return jwt.sign(payload, process.env.JWT_SECRET, options); // (payload, secret, option)
};

const createRefreshToken = () => {
	const payload = { id: uuidv4() };
	const options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN };

	return {
		tokenId: payload.id,
		token: jwt.sign(payload, process.env.JWT_SECRET, options),
	};
};

exports.createTokens = async (userId, res) => {
	const accessToken = createAccessToken(userId);
	const { tokenId: refreshTokenId, token: refreshToken } = createRefreshToken();

	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	console.log(`accessToken: ${accessToken}`);
	console.log(`refreshTokenId: ${refreshTokenId}`);
	console.log(`refreshToken: ${refreshToken}`);
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

	// refreshToken добавляется в базу всех reshresh-токенов
	await Token.create({ tokenId: refreshTokenId });

	// конфигурация куки
	const accessCookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000
			// минуты
		),
		httpOnly: true,
	};

	const refreshCookieOptions = {
		expires: new Date(
			Date.now() +
				process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
			// сутки
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		accessCookieOptions.secure = true;
		refreshCookieOptions.secure = true;
	}

	res.cookie("access-token", accessToken, accessCookieOptions);
	res.cookie("refresh-token", refreshToken, refreshCookieOptions);
};

exports.refreshTokens = async () => {
	const refreshTkn = req.cookies["refresh-token"];

	if (!refreshTkn) {
		return null;
	}
};
