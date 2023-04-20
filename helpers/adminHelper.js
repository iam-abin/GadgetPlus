const userSchema = require('../models/userModel');

module.exports = {
    findUsers: () => {
        return new Promise(async (resolve, reject) => {
            await userSchema.find()
                .then((response) => {
                    resolve(response)
                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
        })
    },

    blockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await userSchema.updateOne({ _id: userId }, { $set: { isActive: false } })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },

    unBlockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await userSchema.updateOne({ _id: userId }, { $set: { isActive: true } })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    }

}