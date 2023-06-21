
const userSchema = require('../models/userModel');
const productSchema = require('../models/productModel');
const orderSchema = require('../models/orderModel')
const categorySchema = require('../models/category')
const adminSchema = require('../models/adminModel')




module.exports = {

    isAdminExists:(adminName,adminPassword)=>{
        return new Promise(async (resolve,reject)=>{
            const isAdminExist=  await adminSchema.findOne({email:adminName,password:adminPassword}) 
            resolve(isAdminExist)
        })
    },

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
            // if(user.isActive){
            //     req.session.user=false
            // }
            user.isActive = !user.isActive
            await user.save()

            resolve(user)
        })
    },

    findAUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await userSchema.findById({ _id: userId })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })

        })
    },

    getDashboardDetails: () => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let totalRevenue, monthlyRevenue, totalProducts;

            totalRevenue = await orderSchema.aggregate([
                {
                    $match: { orderStatus: 'delivered' }
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$totalAmount' }
                    }
                }
            ])

            if(!response.totalRevenue){
                response.totalRevenue=0
            }
            response.totalRevenue = totalRevenue[0]?.revenue;
 



            monthlyRevenue = await orderSchema.aggregate([
                {
                    $match: {
                        orderStatus: 'delivered',
                        orderDate: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$totalAmount' }
                    }
                }
            ])
            response.monthlyRevenue = monthlyRevenue[0]?.revenue

            totalProducts = await productSchema.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$product_quantity" }
                    }
                }
            ])
            response.totalProducts = totalProducts[0]?.total;

            response.totalOrders = await orderSchema.find({ orderStatus: 'confirmed' }).count();

            response.numberOfCategories = await categorySchema.find({}).count();

            console.log(response);
            resolve(response)
        })
    },

    getChartDetails: () => {
        return new Promise(async (resolve, reject) => {
            const orders = await orderSchema.aggregate([
                {
                    $match: { orderStatus: 'delivered' }
                },
                {
                    $project: {
                        _id: 0,
                        orderDate: "$createdAt"
                    }
                }
            ])

            let monthlyData = []
            let dailyData = []

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            let monthlyMap = new Map();
            let dailyMap = new Map();

            //converting to monthly order array

            //taking the count of orders in each month
            orders.forEach((order) => {
                const date = new Date(order.orderDate);
                const month = date.toLocaleDateString('en-US', { month: 'short' });

                if (!monthlyMap.has(month)) {
                    monthlyMap.set(month, 1);
                } else {
                    monthlyMap.set(month, monthlyMap.get(month) + 1);
                }
            })

            for (let i = 0; i < months.length; i++) {
                if (monthlyMap.has(months[i])) {
                    monthlyData.push(monthlyMap.get(months[i]))
                } else {
                    monthlyData.push(0)
                }
            }

            //taking the count of orders in each day of a week
            orders.forEach((order) => {
                const date = new Date(order.orderDate);
                const day = date.toLocaleDateString('en-US', { weekday: 'long' })

                if (!dailyMap.has(day)) {
                    dailyMap.set(day, 1)
                } else {
                    dailyMap.set(day, dailyMap.get(day) + 1)
                }
            })

            for (let i = 0; i < days.length; i++) {
                if (dailyMap.has(days[i])) {
                    dailyData.push(dailyMap.get(days[i]))
                } else {
                    dailyData.push(0)
                }
            }

            resolve({ monthlyData: monthlyData, dailyData: dailyData })

        })
    }

   
}