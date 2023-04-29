const userSchema = require('../models/userModel');
const bcrypt = require('bcrypt');



module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await userSchema.findOne({ email: userData.email })
            let response = {}
            if (user) {
                if (user.isActive) {
                    bcrypt.compare(userData.password, user.password).then((result) => {
                        if (result) {
                            response.user = user;
                            response.loggedIn = true;
                            response.logginMessage = "Login success";
                            console.log("Login success");
                            resolve(response)
                        } else {
                            response.logginMessage = "Invalid username or passworddd";
                            //    console.log("Loggin failed");
                            resolve(response)

                        }
                    })
                } else {
                    response.logginMessage = "blocked user";
                    // console.log("blocked user");
                    resolve(response)
                }
            } else {
                response.logginMessage = "Invalid username or password";
                // console.log("Invalid username or password");
                resolve(response)

            }
        })
    },

    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {
            const isUserExist = await userSchema.findOne({ $or: [{ email: userData.email }, { phone: userData.phone }] });
            if (!isUserExist) {
                userData.password = await bcrypt.hash(userData.password, 10);
                userSchema.create({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    isActive: true,
                }).then((data) => {
                    resolve(data)
                }).catch((error) => {
                    reject(error)
                })
            } else {

                resolve({ userExist: true })
            }
        })

    }

}
