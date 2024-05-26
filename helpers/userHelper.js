const userModel = require("../models/userModel");

const bcrypt = require("bcrypt");

module.exports = {
	doLogin: async (userData) => {
        let response = {};
        
		try {
			let user = await userModel.findOne({ email: userData.email });
			if (!user) {
				response.logginMessage = "Invalid username or passwordd";
				return response;
			}

			if (!user.isActive) {
				response.logginMessage = "blocked user";
				return response;
			}

			const passwordCorrect = await bcrypt.compare(
				userData.password,
				user.password
			);

			if (!passwordCorrect) {
				response.logginMessage = "Invalid username or passwordd";
				return response;
			}

			// if user present in d
			response.user = user;
			response.loggedIn = true;
			response.logginMessage = "Login success";
			return response;
            
		} catch (error) {
			throw error;
		}
	},

	doSignup: async (userData) => {
		try {
			const isUserExist = await userModel.findOne({
				$or: [{ email: userData.email }, { phone: userData.phone }],
			});
			if (!isUserExist) {
				userData.password = await bcrypt.hash(userData.password, 10);
				const user = await userModel.create({
					name: userData.name,
					email: userData.email,
					phone: userData.phone,
					password: userData.password,
					isActive: true,
				});

				return user;
			} else {
				return { userExist: true };
			}
		} catch (error) {
			throw error;
		}
	},

	changePassword: async (newPassword, phone) => {
		try {
			newPassword = await bcrypt.hash(newPassword, 10);
			let user = await userModel.findOne({ phone });
			user.password = newPassword;
			await user.save();
			return user;
		} catch (error) {
			throw error;
		}
	},
};
