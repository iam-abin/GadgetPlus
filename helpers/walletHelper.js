const walletSchema=require('../models/walletModel');

const ObjectId=require('mongoose').Types.ObjectId;

module.exports={

    addMoneyToWallet:(userId,amount)=>{
        return new Promise(async (resolve,reject)=>{
            let wallet=await walletSchema.findOne({user:userId});

            if(!wallet){
                wallet=new walletSchema({
                    user:userId,
                    walletBalance: amount 
                })
            }else{
                wallet.walletBalance+=amount;
            }

            await wallet.save();
            resolve(wallet);
        })
    },


    payUsingWallet:(userId,amount)=>{
        return new Promise(async (resolve,reject)=>{
            let wallet=await walletSchema.findOne({user:userId});

            if(!wallet){
                return resolve(false)
            }

            if(wallet.walletBalance>=amount){
                wallet.walletBalance-=amount;
            }else{
                resolve(false) ;
            }

            await wallet.save();
            resolve(true);
        })
    },


    walletBalance:(userId)=>{
        return new Promise(async (resolve,reject)=>{
            await walletSchema.aggregate([
               {
                $match:{user:new ObjectId(userId)}
               },
               {
                $project:{walletBalance:1}
               }
            ])
            .then((balance)=>{
                if(!balance.length){
                    resolve(0);
                }else{
                    resolve(balance[0].walletBalance);
                }
            })
        })
    }

}


                