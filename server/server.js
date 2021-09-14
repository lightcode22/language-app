const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
	"<password>",
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("successfully connected to Mongo database"));

// mongoose
// 	.connect(process.env.DATABASE_LOCAL, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	})
// 	.then(() => console.log("successfully connected to Mongo database"));

const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`the server has started on port ${port}`);
});
