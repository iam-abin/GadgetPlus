const errorHandler = (error, req, res, next) => {
	res.locals.message = error.message;
	const status = error.status || 500;
	res.locals.status = status;
	console.error("💥", error);
	res.status(status).render("error", { headerFooter: true });
	// return res.status(500).json({errors: "something went wrong" });
};

module.exports = errorHandler;
