const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwtHelper = require("../utils/jwtHelper");
const bcrypt = require("bcryptjs");
const promisify = require("util").promisify;

exports.login = catchAsync(async (req, res) => {
	const { username, password } = req.body;

	const submitErrors = [];

	if (!username) {
		submitErrors.push("username_empty");
	}
	if (!password) {
		submitErrors.push("password_empty");
	}

	if (submitErrors.length) {
		return res.status(401).json(submitErrors);
	}

	const user = await User.findOne({ username }).select("+password");

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json("wrong_credentials");
	}

	// выдать пару токенов
	jwtHelper
		.createTokens(user._id, res)
		.then(() => {
			res.status(200).json({
				status: "success",
				data: {
					role: user.role,
				},
			});
		})
		.catch((err) => {
			return new AppError(err.message, 500);
		});
});

exports.logout = catchAsync(async (req, res) => {
	const refreshToken = req.cookies["refresh-token"];

	if (req.cookies["access-token"]) {
		cookies.set("access-token", { expires: Date.now() });
	}

	if (req.cookies["refresh-token"]) {
		cookies.set("refresh-token", { expires: Date.now() });
		await jwtHelper.deleteRefreshToken(refreshToken);
	}

	// нужно изменить статус
	return res.status(200).json("you've been successfully logged out");
});

exports.register = catchAsync(async (req, res) => {
	let { username, email, password } = req.body;

	const submitErrors = [];

	if (!username) {
		submitErrors.push("username_empty");
	} else if (username.length < 5) {
		submitErrors.push("username_short");
	}

	if (!email) {
		email = undefined;
		// submitErrors.push("email_empty");
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		// регулярное выражение для проверки на соответствие формату e-mail
		submitErrors.push("email_incorrect");
	}

	if (!password) {
		submitErrors.push("password_empty");
	} else if (password.length < 8) {
		submitErrors.push("password_short");
	}

	if (submitErrors.length) {
		return res.status(400).json(submitErrors);
	}

	let query = User.find();
	query = query.or([{ username }, { email }]);
	query.projection("username email");

	const result = await query;

	if (result.some((e) => e.username === username)) {
		submitErrors.push("username_taken");
	}
	if (email && result.some((e) => e.email === email)) {
		submitErrors.push("email_taken");
	}

	if (submitErrors.length) {
		return res.status(400).json(submitErrors);
	}

	password = await bcrypt.hash(password, 12);

	const newUser = await User.create({
		username,
		email,
		password,
		registrationDate: new Date(),
	});

	jwtHelper
		.createTokens(newUser._id, res)
		.then(() => {
			res.status(201).json({
				status: "success",
				data: {
					role: newUser.role,
				},
			});
		})
		.catch((err) => {
			return new AppError(err.message, 500);
		});
});

// = = = = = = = = = = проверка на наличие токена
exports.checkToken = catchAsync(async (req, res, next) => {
	let token = req.cookies["access-token"];

	if (!token) {
		const refreshToken = req.cookies["refresh-token"];

		if (!refreshToken) {
			return next();
		}

		let refreshPayload;

		try {
			refreshPayload = await promisify(jwt.verify)(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET
			);
		} catch (e) {
			console.log(e);
		}

		let tokenId = await Token.findOne({ userId: refreshPayload.userId });

		token = await jwtHelper.refreshTokenPair(tokenId, res);
	}

	let decodedToken;

	try {
		decodedToken = await promisify(jwt.verify)(
			token,
			process.env.ACCESS_TOKEN_SECRET
		);
	} catch (e) {
		res.clearCookie("access-token", { path: "/" });
	}

	if (!decodedToken) {
		return next();
	}

	const currentUser = await User.findById(decodedToken.userId);

	if (!currentUser) {
		res.clearCookie("access-token", { path: "/" });

		if (req.cookies["refresh-token"]) {
			res.clearCookie("refresh-token", { path: "/" });
			await jwtHelper.deleteRefreshToken(req.cookies["refresh-token"]);
		}

		console.log("такого пользователя больше не существует");
		return next();
	}

	if (currentUser.changedPasswordAfter(decodedToken.iat)) {
		cookies.set("access-token", { expires: Date.now() });
		cookies.set("refresh-token", { expires: Date.now() });

		await jwtHelper.deleteRefreshToken(req.cookies["refresh-token"]);

		return next();
	}

	req.userRole = currentUser.role;
	next();
});

exports.checkAccess = (req, res, next) => {
	return res.status(200).json(req.userRole);
};

exports.restrictTo = (...roles) => {
	return (req, _, next) => {
		if (!roles.includes(req.userRole)) {
			return next(new AppError("Нет прав для выполнения этого действия", 403));
		}

		next();
	};
};
