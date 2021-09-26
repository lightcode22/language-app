const promisify = require("util").promisify;
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const createAccessToken = (userId) => {
	const payload = { userId };
	const options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN };

	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options); // (payload, secret, option)
};

// userId не нужен
const createRefreshToken = (userId) => {
	const payload = { id: uuidv4(), userId };
	const options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN };

	return {
		tokenId: payload.id,
		userId,
		token: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options),
	};
};

const createTokens = async (userId, res) => {
	const accessToken = createAccessToken(userId);

	const { tokenId: refreshTokenId, token: refreshToken } =
		createRefreshToken(userId);

	// refreshToken добавляется в базу всех reshresh-токенов
	await Token.create({ tokenId: refreshTokenId, userId });

	const accessCookieOptions = {
		expires: new Date(
			Date.now() + process.env.ACCESS_TOKEN_COOKIE_EXPIRES_IN * 60 * 1000
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

	return { accessToken, refreshToken };
};

const refreshTokenPair = async (payload, res) => {
	await Token.deleteOne({ tokenId: payload.tokenId });

	const { accessToken } = await createTokens(payload.userId, res);

	return accessToken;
};

const deleteRefreshToken = async (refreshToken) => {
	await promisify(jwt.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET)
		.then((payload) => {
			Token.deleteOne({ tokenId: payload.tokenId });
		})
		.catch((e) => {
			console.log("не удалось удалить refreshToken из БД");
		});
};

exports.createTokens = createTokens;
exports.refreshTokenPair = refreshTokenPair;
exports.deleteRefreshToken = deleteRefreshToken;
