const promisify = require("util").promisify;
const Token = require("../models/tokenModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const createAccessToken = (userId) => {
	const payload = { userId };
	const options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN };

	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options); // (payload, secret, option)
};

const createRefreshToken = (userId) => {
	const payload = { id: uuidv4() };
	const options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN };

	return {
		tokenId: payload.id,
		userId,
		token: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options),
	};
};

exports.createTokens = async (userId, res) => {
	console.log("tut oshibka? 00");

	const accessToken = createAccessToken(userId);

	console.log("tut oshibka? 01");

	const { tokenId: refreshTokenId, token: refreshToken } =
		createRefreshToken(userId);

	console.log("tut oshibka? 02");

	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
	console.log(`accessToken: ${accessToken} \n`);
	console.log(`refreshTokenId: ${refreshTokenId} \n`);
	console.log(`refreshToken: ${refreshToken} \n`);
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

	console.log("tut oshibka? 1");

	// refreshToken добавляется в базу всех reshresh-токенов
	await Token.create({ tokenId: refreshTokenId, userId });

	console.log("tut oshibka? 2");

	// конфигурация куки
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

exports.refreshTokenPair = async (payload) => {
	await Token.deleteOne({ tokenId: payload.tokenId });

	const { accessToken } = jwtHelper.createTokens(payload.id, res);

	return accessToken;

	// await Token.findOneAndUpdate({ name: 'aaa bbb' }, update, {
	// 	// если не нашлось, то создаст
	// 	upsert: true,
	// });
};

exports.deleteRefreshToken = async (refreshToken) => {
	await promisify(jwt.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET)
		.then((payload) => {
			console.log(payload);
			console.log(payload.tokenId);
			Token.deleteOne({ tokenId: payload.tokenId });
		})
		.catch((e) => {
			console.log("не удалось удалить refreshToken из БД");
		});
};
