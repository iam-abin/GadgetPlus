const walletModel = require("../models/walletModel");

const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
	addMoneyToWallet: async (userId, amount) => {
		try {
			let wallet = await walletModel.findOne({ user: userId });

			if (!wallet) {
				wallet = new walletModel({
					user: userId,
					walletBalance: amount,
				});
			} else {
				wallet.walletBalance += amount;
			}
			
			await wallet.save();
			return wallet;
		} catch (error) {
			throw error;
		}
	},

	payUsingWallet: async (userId, amount) => {
		try {
			let wallet = await walletModel.findOne({ user: userId });

			if (!wallet) {
				throw new Error("Insufficient balance")
			}

			// reduce the wallet amount
			if (wallet.walletBalance >= amount) {
				wallet.walletBalance -= amount;
			} else {
				return false;
			}

			await wallet.save();
			return true;
		} catch (error) {
			throw error;
		}
	},

	walletBalance: async (userId) => {
		try {
			const balance = await walletModel.aggregate([
				{
					$match: { user: new ObjectId(userId) },
				},
				{
					$project: { walletBalance: 1 },
				},
			]);

			if (!balance.length) {
				return 0;
			} else {
				return balance[0].walletBalance;
			}
		} catch (error) {
			throw error;
		}
	},
};
