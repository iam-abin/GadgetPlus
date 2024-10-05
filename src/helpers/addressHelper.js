const addressModel = require("../models/addressModel");

module.exports = {
	addAddress: async (addressData) => {
		try {
			let address = await new addressModel({
				first_name: addressData.fname,
				last_name: addressData.lname,
				mobile: addressData.mobile,
				email_id: addressData.email,
				address: addressData.address,
				city: addressData.city,
				state: addressData.state,
				country: addressData.country,
				pincode: addressData.pincode,
				userId: addressData.id,
			});

			await address.save();
			return address;
		} catch (error) {
			throw error;
		}
	},

	getAnAddress: async (addressId) => {
		try {
			const address = await addressModel.findById(addressId);
			return address;
		} catch (error) {
			throw error;
		}
	},

	findAddresses: async (userId) => {
		try {
			const address = await addressModel.find({ userId });
			return address;
		} catch (error) {
			throw error;
		}
	},

	editAnAddress: async (editedAddress) => {
		try {
			let address = await addressModel.findById(editedAddress.addressId);
			address.first_name = editedAddress.fname;
			address.last_name = editedAddress.lname;
			address.mobile = editedAddress.mobile;
			address.email_id = editedAddress.email;
			address.address = editedAddress.address;
			address.country = editedAddress.country;
			address.state = editedAddress.state;
			address.city = editedAddress.city;
			address.pincode = editedAddress.pincode;

			await address.save();
			return address;
		} catch (error) {
			throw error;
		}
	},

	deleteAnAddress: async (addressId) => {
		try {
			const deleted = await addressModel.findByIdAndDelete(addressId);
			return deleted;
		} catch (error) {
			throw error;
		}
	},
};
