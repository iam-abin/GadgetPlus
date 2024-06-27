// // const winston = require('winston')
// const { createLogger, format, transports } = require("winston");
// const { combine, timestamp, printf } = format;

// const myFormat = printf(({ level, message, label, timestamp }) => {
// 	return `${timestamp} [${label}] ${level}: ${message}`;
// });

// const winstonLogger = createLogger({
// 	level: "info", // error: 0, warn: 1, info: 2 will be printed.
// 	format: combine(timestamp({ format: "HH:mm:ss" }), myFormat),
// 	transports: [
// 		new transports.Console(),
// 		new transports.File({ filename: "error.log", level: "error" }),
// 	],
// });

const errorHandler = (error, req, res, next) => {
	res.locals.message = error.message || "Internal server Error";
	const status = error.status || 500;
	res.locals.status = status;
	console.log("=============================");
	console.log("💥", error.stack);
	console.log("=============================");
	
	// winstonLogger.error(error.message, error);
	// if (process.env.NODE_ENV !== "production") {
	// 	winstonLogger.add(
	// 		new transports.Console({
	// 			format: winston.format.simple(),
	// 		})
	// 	);
	// }

	// res.status(status).render("error", { headerFooter: true });
	return res.status(500).send({error: true,
				message: error.message||"something went wrong" });
};

module.exports = errorHandler;
