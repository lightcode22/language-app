const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route("/users").get(adminController.getAll);

module.exports = router;
