const orderSchema = require('../models/orderModel');
const addressSchema = require('../models/addressModel');
const ObjectId = require('mongoose').Types.ObjectId;


function orderDate() {
    const date = new Date();
    console.log(date);
    // let orderDate = date.toLocaleDateString("en-IN", {
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    // });
    // let orderDate=`${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    // console.log("HHHHHHHHi", orderDate);



    return date
}

function orderStatusCount(orderStatuses){
    let counts={};

    orderStatuses.forEach(oneStatus => {
        let status=oneStatus.orderStatus
        // console.log(typeof status);
        if(counts[status]){
            counts[status]++;
        }else{
            counts[status]=1;
        }

        counts.pending=1; //need to remove after adding razorpay
        counts.processing=6;
        counts.cancelPending=7;
        counts.canceled=3

    });
    console.log(counts);
    return counts
}


module.exports = {
    orderPlacing: (order, totalAmount, cartItems) => {
        return new Promise(async (resolve, reject) => {
            let status = order.payment == 'COD' ? 'confirmed' : 'pending';
            let date = orderDate();
            let userId = order.userId;
            // let address= await addressSchema.findById({_id:order.addressSelected});
            let paymentMethod=order.payment;
            let addressId = order.addressSelected;
            let orderedItems = cartItems
            console.log("orderedItems", orderedItems);

            console.log("orderedItems orderHelper ", orderedItems);
            let ordered = new orderSchema({
                user: userId,
                address: addressId,
                orderDate: date,
                totalAmount: totalAmount,
                paymentMethod: paymentMethod,
                orderStatus: status,
                orderedItems: orderedItems
            })
            await ordered.save();
            console.log("upoladed to dbbbbbbbbbbbbbbb");
            resolve(ordered);
        })
    },


    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            await orderSchema.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                }
            ])
                .then((result) => {
                    console.log(result);
                    resolve(result)
                })
        })
    },

    getAllOrderStatusesCount: async()=>{
        try {
            const orderStatuses= await orderSchema.find().select({_id:0,orderStatus:1})

            const eachOrderStatusCount= orderStatusCount(orderStatuses);

            return eachOrderStatusCount
        } catch (error) {
            console.log(error);
        }
    },

    getAllOrderDetailsOfAUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            const userOrderDetails = await orderSchema.aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $lookup:{
                        from:'addresses',
                        localField:'address',
                        foreignField:'_id',
                        as:'addressLookedup'
                    }
                },
                
            ])

            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("This is aggregation resilt", userOrderDetails);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");


            resolve(userOrderDetails)
        })
    },

    changeOrderStatus:async (orderId,changeStatus)=>{
        try {
            
           const orderstatusChange=await orderSchema.findOneAndUpdate({_id:orderId},
            {
                $set:{
                    orderStatus:changeStatus
                }
            })

            if(orderstatusChange){
                return {error:false,message:'order status updated'}
            }else{
                return {error:true,message:'something goes wrong updation failed'}
            }

        } catch (error) {
            throw new Error('failed to change status!something wrong');
        }
    },

    //------------------=--------------------------------------------------

    getOrderedUserDetailsAndAddress: (orderId) => {
        return new Promise(async(resolve,reject)=>{
            await orderSchema.aggregate([
                {
                    $match: { _id: new ObjectId(orderId) }
                },
                
                {
                    $lookup:{
                        from:'addresses',
                        localField:'address',
                        foreignField:'_id',
                        as:'userAddress'
                    }
                },
                {
                    $project:{
                        user:1,
                        totalAmount:1,
                        paymentMethod:1,
                        address:{
                            $arrayElemAt:['$userAddress',0]
                        }
                    }
                },
            ]).then((result)=>{
                console.log(result);
                // console.log("hi");
                // console.log(result);
                // console.log("----------------");
                // console.log(result[0].address);
                // console.log("hi");

                resolve(result[0])
            })
        })
    },

    //------------------=--------------------------------------------------

    // orderDetails:(orderId)=>{
    //    return new Promise(async (resolve,reject)=>{
    //     await orderSchema.find({_id:orderId}).
    //     then((result)=>{
    //         // console.log("totalAmount",result[0].totalAmount);
    //         resolve(result[0])
    //     })
    //    })
    // },

    getOrderedProductsDetails: (orderId) => {
        return new Promise(async(resolve,reject)=>{
            await orderSchema.aggregate([
                {
                    $match:{_id: new ObjectId(orderId)}
                },
                {
                    $unwind:'$orderedItems'
                },
                {
                    $lookup:{
                        from:'products',
                        localField:'orderedItems.product',
                        foreignField:'_id',
                        as:'orderedProduct'
                    }
                },
                {
                    $unwind:'$orderedProduct'
                }
            ]).then((result)=>{
                console.log("orders",result);
                resolve(result)
            })
        })
    }

}