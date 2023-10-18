const mongoose = require("mongoose");

// db connection start

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		console.log("database connected successfully......");
	} catch (error) {
		console.log(error);
	}
};

// db connection end

module.exports = connectDB;
