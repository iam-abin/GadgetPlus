const couponSchema = require('../models/couponModel')
const cartSchema = require('../models/cartModel')

const voucherCode=require('voucher-code-generator')


module.exports = {

    addCouponToDb: (couponData) => {
        return new Promise(async (resolve, reject) => {
            
            const dateString = couponData.couponExpiry;
            const [day, month, year] = dateString.split(/[-/]/);
            const date = new Date(`${year}-${month}-${day}`);
            const convertedDate = date.toISOString();

            let couponCode=voucherCode.generate({
                length: 6,
                count: 1,
                charset: voucherCode.charset("alphabetic")
            });

            const coupon = await new couponSchema({
                couponName: couponData.couponName,
                code: couponCode[0],
                discount: couponData.couponAmount,
                expiryDate: convertedDate
            })

            await coupon.save()
                .then(() => {
                    resolve(coupon._id);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },


    getAllCoupons: () => {
        return new Promise(async (resolve, reject) => {
            await couponSchema.find().lean()
                .then((result) => {
                    resolve(result);
                })
        })
    },


    getACoupenData: (couponId)=>{
        return new Promise(async(resolve,reject)=>{
            await couponSchema.findOne({_id:couponId})
            .then((result)=>{
                resolve(result);
            })
        })
    },


    editCoupon:(couponAfterEdit)=>{
        return new Promise(async (resolve,reject)=>{
            let coupon=await couponSchema.findById({_id:couponAfterEdit.couponId});
            coupon.couponName=couponAfterEdit.couponName;
            coupon.discount=couponAfterEdit.couponAmount;
            coupon.expiryDate=couponAfterEdit.couponExpiry;

            await coupon.save();
            resolve(coupon);
        })
    },


    deleteACoupon:(couponId)=>{
        return new Promise(async(resolve,reject)=>{
            let result = await couponSchema.findOneAndDelete({_id:couponId});
             resolve(result);
        })
    },


    applyCoupon: (userId, couponCode, totalAmount) => {
        return new Promise(async (resolve, reject) => {
            let coupon = await couponSchema.findOne({ code: couponCode });
   
            if (coupon && coupon.isActive == 'Active') {
                if (!coupon.usedBy.includes(userId)) {
                    let cart = await cartSchema.findOne({ user: userId });
                    const discount=coupon.discount;

                    cart.totalAmount = cart.totalAmount - coupon.discount;
                    cart.coupon=couponCode;
                    await cart.save();

                    coupon.usedBy.push(userId);
                    await coupon.save();
                    resolve({discount, cart, status: true, message: "coupn added successfully" });
                } else {
                    resolve({ status: false, message: "Coupon code already used" });
                }
            } else {
                resolve({ status: false, message: "invalid Coupon code" });
            }
        })
    },

}