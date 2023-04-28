const { response } = require('express');
const userSchema = require('../models/userModel');
const productSchema=require('../models/productModel');
const categorySchema=require('../models/category')

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

    blockOrUnBlockUser: (userId) => {
        
        return new Promise(async (resolve, reject) => {
            const user = await userSchema.findById(userId);
            
            user.isActive = !user.isActive
            await user.save()

            resolve(user)
        })
    },

    findAUser:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await userSchema.findById({_id:userId})
            .then((result)=>{
                resolve(result);
            })
            .catch((error)=>{
                console.log(error);
            })
        
        })
    }, 

   
}