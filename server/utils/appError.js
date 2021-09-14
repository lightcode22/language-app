class AppError extends Error {
	constructor(message, statusCode) {
		// родительский конструктор принимает только 1 аргумент - message
		super(message);

		this.statusCode = statusCode;
		// 4xx статус - fail, другие - error
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

		// весь этот Error для операционных ошибок
		this.isOperational = true;

		// у создаваемого объекта ошибки нет собственного captureStackTrace
		// поэтому он берется у Error, на основе которого создается свой объект
		// первый аргумент - куда записывается стек вызовов
		// this - значит, в создаваемый объект ошибки
		// второй аргумент - до какого момента будет выведен стек (необязательный)
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
