const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		product_name: {
			type: String,
			required: true,
			unique: true,
		},
		product_description: {
			type: String,
		},

		product_category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "categories",
			required: true,
		},
		product_price: {
			type: Number,
			required: true,
		},
		product_quantity: {
			type: Number,
			required: true,
		},
		product_discount: {
			type: Number,
			required: true,
		},
		image: {
			type: Array,
			required: true,
		},
		product_status: {
			type: Boolean,
			default: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("product", productSchema);
