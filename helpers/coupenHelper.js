const couponModel = require("../models/couponModel");
const cartModel = require("../models/cartModel");

const voucherCode = require("voucher-code-generator");

module.exports = {
	addCouponToDb: async (couponData) => {
		try {
			const dateString = couponData.couponExpiry;
			const [day, month, year] = dateString.split(/[-/]/);
			const date = new Date(`${year}-${month}-${day}`);
			const convertedDate = date.toISOString();

			let couponCode = voucherCode.generate({
				length: 6,
				count: 1,
				charset: voucherCode.charset("alphabetic"),
			});

			const coupon = await new couponModel({
				couponName: couponData.couponName,
				code: couponCode[0],
				discount: couponData.couponAmount,
				expiryDate: convertedDate,
			});

			await coupon.save();
			return coupon._id;
		} catch (error) {
			throw error;
		}
	},

	getAllCoupons: async () => {
		try {
			const coupons = await couponModel.find().lean();
			return coupons;
		} catch (error) {
			throw error;
		}
	},

	getACoupenData: async (couponId) => {
		try {
			const coupon = await couponModel.findOne({ _id: couponId });
			return coupon;
		} catch (error) {
			throw error;
		}
	},

	editCoupon: async (couponAfterEdit) => {
		try {
			let coupon = await couponModel.findById(couponAfterEdit.couponId);
			coupon.couponName = couponAfterEdit.couponName;
			coupon.discount = couponAfterEdit.couponAmount;
			coupon.expiryDate = couponAfterEdit.couponExpiry;

			await coupon.save();
			return coupon;
		} catch (error) {
			throw error;
		}
	},

	deleteACoupon: async (couponId) => {
		try {
			let result = await couponModel.findOneAndDelete({ _id: couponId });
			return result;
		} catch (error) {
			throw error;
		}
	},

	applyCoupon: async (userId, couponCode, totalAmount) => {
		try {
			let coupon = await couponModel.findOne({ code: couponCode });
			if (!coupon) throw new Error("Coupon not found");
			if (coupon.isActive !== "Active")
				return { status: false, message: "invalid Coupon code" };
			if (coupon.usedBy.includes(userId))
				return {
					status: false,
					message: "Coupon code already used",
				};
			// if coupon not used
			let cart = await cartModel.findOne({ user: userId });
			const discount = coupon.discount;

			cart.totalAmount = cart.totalAmount - coupon.discount;
			cart.coupon = couponCode;
			await cart.save();

			coupon.usedBy.push(userId);
			await coupon.save();
			return {
				discount,
				cart,
				status: true,
				message: "coupn added successfully",
			};
		} catch (error) {
			throw error;
		}
	},
};
