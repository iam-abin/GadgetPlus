const userSchema = require('../models/userModel');
const bcrypt = require('bcrypt');



module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await userSchema.findOne({ email: userData.email })
            let response = {}
            if (user) {
                bcrypt.compare(userData.password, user.password).then((result) => {
                    if (result) {
                        response.user=user;
                        console.log("Login success");
                        response.loggedIn = true;
                        resolve(response)
                    } else {
                       resolve({loggedIn:false})
                       console.log("Loggin failed");
                    }
                })
            } else {
                resolve({ status: false })
                console.log("User not Found");
            }
        })
    },

    doSignup: (userData)=>{

        return new Promise(async (resolve,reject)=>{
            const isUserExist = await userSchema.findOne({$or:[{ email: userData.email },{ phone: userData.phone }]});
            if(!isUserExist){
                userData.password=await bcrypt.hash(userData.password, 10);
                userSchema.create({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    isActive:false,
                }).then((data) => {
                    resolve(data)
                }).catch((error) => {
                    reject(error)
                })
            }else{
                
                resolve({userExist:true})
            }
        })

    }

}
