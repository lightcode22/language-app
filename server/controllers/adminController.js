const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res) => {
	try {
		let query = User.find();
		query = query.select("username email registrationDate role active");

		let users = await query;

		console.log(users);

		res.send({
			result: users.length,
			users,
		});
	} catch (err) {
		console.log(err);
	}
});
