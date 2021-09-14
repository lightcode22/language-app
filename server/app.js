const express = require("express");
// const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const affixRouter = require("./routes/affixRoutes");

const { checkToken } = require("./controllers/authController");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

console.log(process.env.NODE_ENV);

app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));

app.use(checkToken);

app.use("/auth", authRouter);
app.use("/affixes", affixRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
