const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const categoryModel = require("../models/category");
const adminModel = require("../models/adminModel");

module.exports = {
	isAdminExists: async (adminName, adminPassword) => {
		try {
			const isAdminExist = await adminModel.findOne({
				$and: [{ email: adminName }, { password: adminPassword }],
			});
			return isAdminExist;
		} catch (error) {
			throw error;
		}
	},

	findUsers: async () => {
		try {
			const users = await userModel.find();
			return users;
		} catch (error) {
			throw error;
		}
	},

	blockOrUnBlockUser: async (userId) => {
		try {
			const user = await userModel.findById(userId);
			if (!user) throw new Error("No such user!!!");
			user.isActive = !user.isActive;
			await user.save();
			return user;
		} catch (error) {
			throw error;
		}
	},

	findAUser: async (userId) => {
		try {
			const user = await userModel.findById(userId);
			return user;
		} catch (error) {
			throw error;
		}
	},

	getDashboardDetails: async () => {
		let response = {};
		let totalRevenue, monthlyRevenue, totalProducts;

		try {
			// Total revenue
			totalRevenue = await orderModel.aggregate([
				{
					$match: { orderStatus: "delivered" },
				},
				{
					$group: {
						_id: null,
						revenue: { $sum: "$totalAmount" },
					},
				},
			]);

			!totalRevenue.length
				? (response.totalRevenue = 0)
				: (response.totalRevenue = totalRevenue[0]?.revenue);

			// Monthly revenue
			monthlyRevenue = await orderModel.aggregate([
				{
					$match: {
						orderStatus: "delivered",
						orderDate: {
							$gte: new Date(
								new Date().getFullYear(),
								new Date().getMonth(),
								1
							),
						},
					},
				},
				{
					$group: {
						_id: null,
						revenue: { $sum: "$totalAmount" },
					},
				},
			]);
			
			!monthlyRevenue.length
				? (response.monthlyRevenue = 0)
				: (response.monthlyRevenue = monthlyRevenue[0]?.revenue);

			// Total products
			totalProducts = await productModel.aggregate([
				{
					$group: {
						_id: null,
						total: { $sum: "$product_quantity" },
					},
				},
			]);

			!totalProducts.length
				? (response.totalProducts = 0)
				: (response.totalProducts = totalProducts[0]?.total);

			response.totalOrders = await orderModel
				.find({ orderStatus: "confirmed" })
				.count();

			response.numberOfCategories = await categoryModel
				.find({ status: true })
				.count();

			return response;
		} catch (error) {
			throw error;
		}
	},

	getChartDetails: async () => {
		try {
			const orders = await orderModel.aggregate([
				{
					$match: { orderStatus: "delivered" },
				},
				{
					$project: {
						_id: 0,
						orderDate: "$createdAt",
					},
				},
			]);

			let monthlyData = [];
			let dailyData = [];

			const months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];

			let monthlyMap = new Map();
			let dailyMap = new Map();

			//converting to monthly order array

			//taking the count of orders in each month
			orders.forEach((order) => {
				const date = new Date(order.orderDate);
				const month = date.toLocaleDateString("en-US", {
					month: "short",
				});

				if (!monthlyMap.has(month)) {
					monthlyMap.set(month, 1);
				} else {
					monthlyMap.set(month, monthlyMap.get(month) + 1);
				}
			});

			for (let i = 0; i < months.length; i++) {
				if (monthlyMap.has(months[i])) {
					monthlyData.push(monthlyMap.get(months[i]));
				} else {
					monthlyData.push(0);
				}
			}

			//taking the count of orders in each day of a week
			orders.forEach((order) => {
				const date = new Date(order.orderDate);
				const day = date.toLocaleDateString("en-US", {
					weekday: "long",
				});

				if (!dailyMap.has(day)) {
					dailyMap.set(day, 1);
				} else {
					dailyMap.set(day, dailyMap.get(day) + 1);
				}
			});

			for (let i = 0; i < days.length; i++) {
				if (dailyMap.has(days[i])) {
					dailyData.push(dailyMap.get(days[i]));
				} else {
					dailyData.push(0);
				}
			}

			return { monthlyData: monthlyData, dailyData: dailyData };
		} catch (error) {
			throw error;
		}
	},
};
