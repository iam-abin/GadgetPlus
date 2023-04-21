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

    addCategoryTooDb:(productData)=>{
        return new Promise(async(resolve,reject)=>{
            let category = await new categorySchema({
                name: productData.categoryName,
                description: productData.categoryDescription,
              });
              await category.save();
              resolve(category._id);
        })
    },

    getAllcategory:()=>{
        return new Promise(async (resolve, reject) => {
            let category = await categorySchema.find();
            resolve(category);
          });
    }
}