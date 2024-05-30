const multer = require("multer");

const productStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/product-images");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const productUpload = multer({
	storage: productStorage,
}).fields([
	{ name: "img1", maxCount: 1 },
	{ name: "img2", maxCount: 1 },
	{ name: "img3", maxCount: 1 },
	{ name: "img4", maxCount: 1 },
]);

module.exports = {
	productUpload,
};
