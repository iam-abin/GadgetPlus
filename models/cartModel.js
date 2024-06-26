const mongoose = require("mongoose");

const cartModel = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				productItemId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
				},
			},
		],
		coupon: {
			type: String,
			default: null,
		},
		totalAmount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = new mongoose.model("Cart", cartModel);
