const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwtHelper = require("../utils/jwtHelper");
const bcrypt = require("bcryptjs");
const promisify = require("util").promisify;

// = = = = = = = = = = обработка входа в систему
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

	// по умолчанию при запросе поле password не отображается - поэтому select
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

// = = = = = = = = = = выход из системы
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
	return res
		.status(200)
		.json("you've been successfully logged out. do svidaniya!");
});

// = = = = = = = = = = обработка регистрации нового пользователя
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

	// хэширует пароль из формы с saltRounds/cost = 12
	password = await bcrypt.hash(password, 12);

	const newUser = await User.create({
		username,
		email,
		password,
		// passwordChangedAt: req.body.passwordChangedAt,
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

		await promisify(jwt.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET)
			.then((payload) => {
				console.log(payload);
				console.log(payload.tokenId);
				Token.findOne({ tokenId: payload.tokenId });
				return payload;
			})
			.then((payload) => {
				jwtHelper.refreshTokenPair(payload);
			})
			.then((result) => {
				token = result;
			})
			.then.catch((e) => {
				console.log("недействительный refreshToken");
				cookies.set("refresh-token", { expires: Date.now() });
				return next();
			});
	}

	// расшифрованный access-токен
	let decodedToken;

	await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN)
		.then((token) => {
			decodedToken = token;
		})
		.catch((e) => {
			cookies.set("access-token", { expires: Date.now() });
			// получить новый access-token?
			return next();
		});

	// поиск пользователя с таким токеном
	// нет пользователя = токен недействителен -- разлогинить - удалить refresh-токен
	const currentUser = await User.findById(decodedToken.id);

	if (!currentUser) {
		cookies.set("access-token", { expires: Date.now() });

		if (req.cookies["refresh-token"]) {
			cookies.set("refresh-token", { expires: Date.now() });
			await jwtHelper.deleteRefreshToken(req.cookies["refresh-token"]);
		}

		console.log("такого пользователя больше не существует");
		return next();
	}

	// проверить, менялся ли пароль пользователя после выпуска токена
	// оба токена не обновлялись вместе с паролем = токены устарели -- разлогинить
	if (currentUser.changedPasswordAfter(decodedToken.iat)) {
		cookies.set("access-token", { expires: Date.now() });
		cookies.set("refresh-token", { expires: Date.now() });

		await jwtHelper.deleteRefreshToken(req.cookies["refresh-token"]);

		return next();
	}

	req.userRole = currentUser.role;
	next();
});

// = = = = = = = = = =
exports.checkAccess = () => {
	const { userRole } = req.userRole;
	console.log(`the userRole is: ${userRole}`);

	if (!userRole) {
		return next(new AppError("Вы не залогинены!", 401));
	}
};

// = = = = = = = = = = разграничение доступа по ролям
exports.restrictTo = (...roles) => {
	return (req, _, next) => {
		if (!roles.includes(req.userRole)) {
			return next(new AppError("Нет прав для выполнения этого действия", 403));
		}

		next();
	};
};
