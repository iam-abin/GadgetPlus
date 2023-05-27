const orderSchema = require('../models/orderModel');

const walletHelper = require('./walletHelper');
const ObjectId = require('mongoose').Types.ObjectId;


function orderDate() {
    const date = new Date();
    console.log(date);
    return date
}

function orderStatusCount(orderStatuses) {   //to display on doughnut chart
    let counts = {};

    orderStatuses.forEach(oneStatus => {
        let status = oneStatus.orderStatus
        // console.log(typeof status);
        if (counts[status]) {
            counts[status]++;
        } else {
            counts[status] = 1;
        }

        console.log(status);
        //need to remove after adding razorpay
       
        // counts.cancelPending = 3;
        // counts.canceled = 3

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
            let paymentMethod = order.payment;
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
                    // console.log(result);
                    resolve(result)
                })
        })
    },

    getAllDeliveredOrders: () => {
        return new Promise(async (resolve, reject) => {
            await orderSchema.aggregate([
                {
                    $match: { orderStatus: 'delivered' }
                },
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
                    resolve(result)
                })
        })
    },

    getAllDeliveredOrdersByDate: (startDate, endDate) => {
        return new Promise(async (resolve, reject) => {
            await orderSchema.find({ orderDate: { $gte: startDate, $lte: endDate }, orderStatus: 'delivered' }).lean()
                .then((result) => {
                    console.log("orders in range", result);
                    resolve(result)
                })

        })

    },

    getAllOrderStatusesCount: async () => {
        try {
            const orderStatuses = await orderSchema.find().select({ _id: 0, orderStatus: 1 })

            const eachOrderStatusCount = orderStatusCount(orderStatuses);

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
                    $lookup: {
                        from: 'addresses',
                        localField: 'address',
                        foreignField: '_id',
                        as: 'addressLookedup'
                    }
                },

            ])

            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("This is aggregation resilt", userOrderDetails);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");


            resolve(userOrderDetails)
        })
    },

    changeOrderStatus: async (orderId, changeStatus) => {
        try {

            const orderstatusChange = await orderSchema.findOneAndUpdate(
                { _id: orderId },
                {
                    $set: {
                        orderStatus: changeStatus
                    }
                },
                {
                    new:true
                })
            console.log("----ee---",orderstatusChange,"----ee---");
          
            return orderstatusChange

        } catch (error) {
            throw new Error('failed to change status!something wrong');
        }
    },

    //------------------=--------------------------------------------------

    getOrderedUserDetailsAndAddress: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderSchema.aggregate([
                {
                    $match: { _id: new ObjectId(orderId) }
                },

                {
                    $lookup: {
                        from: 'addresses',
                        localField: 'address',
                        foreignField: '_id',
                        as: 'userAddress'
                    }
                },
                {
                    $project: {
                        user: 1,
                        totalAmount: 1,
                        paymentMethod: 1,
                        orderStatus:1,
                        address: {
                            $arrayElemAt: ['$userAddress', 0]
                        }
                    }
                },
            ]).then((result) => {
                console.log("----------------");

                console.log(result);
                // console.log("hi");
                // console.log(result);
                console.log("----------------");
                // console.log(result[0].address);
                // console.log("hi");

                resolve(result[0])
            })
        })
    },

    getOrderedProductsDetails: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderSchema.aggregate([
                {
                    $match: { _id: new ObjectId(orderId) }
                },
                {
                    $unwind: '$orderedItems'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderedItems.product',
                        foreignField: '_id',
                        as: 'orderedProduct'
                    }
                },
                {
                    $unwind: '$orderedProduct'
                }
            ]).then((result) => {
                console.log("orders", result);
                resolve(result)
            })
        })
    },

    cancelOrder: (userId, orderId) => {
        return new Promise(async (resolve, reject) => {

            console.log(orderId);
            const cancelledResponse = await orderSchema.findOneAndUpdate(
                { _id: new ObjectId(orderId) },
                { $set: { orderStatus: "cancelled" } },
                {new:true}
            )
            console.log("cancelledResponse", cancelledResponse);
            console.log("cancelledResponse.totalAmount", cancelledResponse.totalAmount);

            if(cancelledResponse.paymentMethod!='COD'){
                await walletHelper.addMoneyToWallet(userId,cancelledResponse.totalAmount);
            }


            resolve(cancelledResponse.orderStatus)
        })
    },

    returnOrder:(userId, orderId)=>{
        return new Promise(async (resolve,reject)=>{
            const order = await orderSchema.findOne({_id: new ObjectId(orderId)});
            console.log("order before",order);
            if(order.orderStatus=='delivered'){
                order.orderStatus='return pending'
            }else if(order.orderStatus=='return pending'){
                order.orderStatus='returned'
            }

            await order.save()
            console.log("order after",order);
            resolve(order);
        })
    }

}