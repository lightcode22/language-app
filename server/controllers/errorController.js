const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
	const message = `Неверный ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*\1/)[0];
	const message = `Дублируется значение поля: ${value}. Используйте другое`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Введены неверные данные. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const handleJWTError = (err) =>
	new AppError("Неверный токен. Войдите в систему заново", 401);

const handleJWTExpiredError = (err) => new AppError("Токен истек!", 401);

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	// в продакшене будут выводится только операционные ошибки, но не баги
	// если операционная ошибка
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}
	// если баг
	else {
		// разработчику в консоли будет показана настоящая ошибка
		console.error("ERROR", err);

		// а пользователю - стандартное сообщение
		res
			.status(500)
			.json({ status: "error", message: "Что-то явно пошло не по плану" });
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };

		// если неправильный id
		if (error.name === "CastError") error = handleCastErrorDB(error);

		// если дублируется уникальное поле
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);

		if (error.name === "ValidationError")
			error = handleValidationErrorDB(error);

		if (error.name === "JsonWebTokenError") error = handleJWTError(error);

		if (error.name === "TokenExpiredError")
			error = handleJWTExpiredError(error);

		sendErrorProd(error, res);
	}
};
