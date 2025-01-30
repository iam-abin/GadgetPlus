const orderModel = require("../models/orderModel");

const addressHelper = require("./addressHelper");
const walletHelper = require("./walletHelper");

const ObjectId = require("mongoose").Types.ObjectId;

const transformOrderStatusStructure = (orderStatuses) => {
	//to display on doughnut chart
	let transformedData = {};

	orderStatuses.forEach((item) => {
		transformedData[item._id] = item.count;
	});

	return transformedData;
};

module.exports = {
	orderPlacing: async (order, totalAmount, cartItems) => {
		try {
			let status = order.payment == "COD" ? "confirmed" : "pending";
			let address = await addressHelper.getAnAddress(
				order.addressSelected
			);

			let discount = null;
			if (order.couponDiscount) {
				discount = order.couponDiscount;
			}

			let orderedItems = cartItems;
			let orderedPrices = [];
			for (let i = 0; i < orderedItems.length; i++) {
				orderedPrices.push(orderedItems[i].product.product_price);
			}

			let orderPlaced = new orderModel({
				user: order.userId,
				address: address,
				orderDate: new Date(),
				totalAmount: totalAmount,
				paymentMethod: order.payment,
				orderStatus: status,
				coupon: discount,
				orderedPrice: orderedPrices,
				orderedItems: orderedItems,
			});

			await orderPlaced.save();
			return orderPlaced;
		} catch (error) {
			throw error;
		}
	},

	getAllOrders: async () => {
		try {
			console.log("ads");
			
			const orders = await orderModel.aggregate([
				{
					$lookup: {
						from: "users",
						localField: "user",
						foreignField: "_id",
						as: "userDetails",
					},
				},
				{
					$sort: {
						createdAt: -1
					}
				}
			]);
			return orders;
		} catch (error) {
			throw error;
		}
	},

	getAllDeliveredOrders: async () => {
		try {
			const delivered = await orderModel.aggregate([
				{
					$match: { orderStatus: "delivered" },
				},
				{
					$lookup: {
						from: "users",
						localField: "user",
						foreignField: "_id",
						as: "userDetails",
					},
				},
			]);
			return delivered;
		} catch (error) {
			throw error;
		}
	},

	getAllDeliveredOrdersByDate: async (startDate, endDate) => {
		try {
			const deliveredOrders = await orderModel
				.find({
					orderDate: { $gte: startDate, $lte: endDate },
					orderStatus: "delivered",
				})
				.lean();
			return deliveredOrders;
		} catch (error) {
			throw error;
		}
	},

	getAllOrderStatusesCount: async () => {
		try {
			const orderStatuses = await orderModel.aggregate([
				{ $group: { _id: "$orderStatus", count: { $sum: 1 } } },
			]);

			const eachOrderStatusCount =
				transformOrderStatusStructure(orderStatuses);

			return eachOrderStatusCount;
		} catch (error) {
			throw error;
		}
	},

	getAllOrderDetailsOfAUser: async (userId) => {
		try {
			const userOrderDetails = await orderModel.aggregate([
				{
					$match: { user: new ObjectId(userId) },
				},
				{
					$lookup: {
						from: "addresses",
						localField: "address",
						foreignField: "_id",
						as: "addressLookedup",
					},
				},
				{
					$sort: {
						createdAt: -1
					}
				}
			]);

			return userOrderDetails;
		} catch (error) {
			throw error;
		}
	},

	changeOrderStatus: async (orderId, changeStatus) => {
		try {
			const orderstatusChange = await orderModel.findOneAndUpdate(
				{ _id: orderId },
				{
					$set: {
						orderStatus: changeStatus,
					},
				},
				{
					new: true,
				}
			);

			return orderstatusChange;
		} catch (error) {
			throw new Error("failed to change status!something wrong");
		}
	},

	getOrderedUserDetailsAndAddress: async (orderId) => {
		try {
			const result = await orderModel.aggregate([
				{
					$match: { _id: new ObjectId(orderId) },
				},
				{
					$lookup: {
						from: "addresses",
						localField: "address",
						foreignField: "_id",
						as: "userAddress",
					},
				},
				{
					$project: {
						user: 1,
						totalAmount: 1,
						paymentMethod: 1,
						orderStatus: 1,
						coupon: 1,
						address: {
							$arrayElemAt: ["$userAddress", 0],
						},
					},
				},
			]);

			return result[0];
		} catch (error) {
			throw error;
		}
	},

	getOrderedProductsDetails: async (orderId) => {
		try {
			const orderedProducts = await orderModel.aggregate([
				{
					$match: { _id: new ObjectId(orderId) },
				},
				{
					$unwind: "$orderedItems",
				},
				{
					$lookup: {
						from: "products",
						localField: "orderedItems.product",
						foreignField: "_id",
						as: "orderedProduct",
					},
				},
				{
					$unwind: "$orderedProduct",
				},
			]);

			return orderedProducts;
		} catch (error) {
			throw error;
		}
	},

	cancelOrder: async (userId, orderId) => {
		try {
			const cancelledResponse = await orderModel.findOneAndUpdate(
				{ _id: new ObjectId(orderId) },
				{ $set: { orderStatus: "cancelled" } },
				{ new: true }
			);

			console.log("cancelledResponse ======>", cancelledResponse);
			
			if (cancelledResponse.paymentMethod != "COD") {
				await walletHelper.addMoneyToWallet(
					userId,
					cancelledResponse.totalAmount
				);
			}

			return cancelledResponse.orderStatus;
		} catch (error) {
			throw error;
		}
	},

	returnOrder: async (userId, orderId) => {
		try {
			const order = await orderModel.findOne({
				_id: new ObjectId(orderId),
			});

			if (order.orderStatus == "delivered")
				order.orderStatus = "return pending";

			if (order.orderStatus == "return pending")
				order.orderStatus = "returned";

			await order.save();
			return order;
		} catch (error) {
			throw error;
		}
	},
};
