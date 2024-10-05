const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("database connected successfully......");
	} catch (error) {
		console.log(error);
		throw new Error("Db connection failed")
	}
};

module.exports = connectDB;
