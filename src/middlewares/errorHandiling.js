const winston = require('winston')
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

const winstonLogger = createLogger({
	level: "info", // error: 0, warn: 1, info: 2 will be printed.
	format: combine(timestamp({ format: "HH:mm:ss" }), myFormat),
	transports: [
		new transports.Console(),
		new transports.File({ filename: "error.log", level: "error" }),
	],
});

const errorHandler = (error, req, res, next) => {
    res.locals.message = error.message || "Internal Server Error";
    const status = error.status || 500;
    res.locals.status = status;
    console.error("=============================");
    console.error("💥", error.stack);
    console.error("=============================");
	
	winstonLogger.error(error.message, error);
	
	// if (process.env.NODE_ENV !== "production") {
		winstonLogger.add(
			new transports.Console({
				format: winston.format.simple(),
			})
		);
	// }

	// Render the error page
    if (status === 404) {
        return res.status(404).render('error', { noHeaderFooter: true });
    } else {
        // General error handling for other statuses
        return res.status(status).send({
            error: true,
            message: error.message || "Something went wrong"
        });
    }
};

module.exports = errorHandler;
