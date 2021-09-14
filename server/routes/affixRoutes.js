const express = require("express");
const affixController = require("../controllers/affixController");
const authController = require("../controllers/authController");

const router = express.Router();

router
	.route("/")
	.get(affixController.getAll)
	.post(
		authController.restrictTo(["moderator", "admin"]),
		affixController.createAffix
	);

router.route("/:id").get(affixController.getOne);

module.exports = router;
