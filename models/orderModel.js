const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		orderedItems: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "products",
				},
				quantity: Number,
			},
		],
		orderedPrice: {
			type: Array,
			default: [],
		},
		address: mongoose.Schema.Types.ObjectId,
		orderDate: Date,
		coupon: {
			type: String,
			default: null,
		},
		totalAmount: Number,
		paymentMethod: String,
		orderStatus: {
			type: String,
			enum: [
				"pending",
				"confirmed",
				"shipped",
				"outForDelivery",
				"delivered",
				"cancelled",
				"return pending",
				"returned",
			],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = new mongoose.model("Order", orderSchema);
