const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema(
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
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = new mongoose.model("WishList", wishListSchema);
