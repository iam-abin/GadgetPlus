const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


module.exports = {
    razorpayOrderCreate: (orderId, totalAmount) => {
        return new Promise(async (resolve, reject) => {
            razorpay.orders.create({
                "amount": `${totalAmount * 100}`,
                "currency": "INR",
                "receipt": `${orderId}`,
                payment_capture: 1,
            })
                .then((orderDetails) => {
                    console.log("razorpay orderDetailsorderDetails razorpay :", orderDetails);
                    resolve(orderDetails)
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },

    verifyPaymentSignature: (details) => {
        return new Promise(async (resolve, reject) => {

            let body = details['payment[razorpay_order_id]'] + "|" + details['payment[razorpay_payment_id]'];

            const crypto = require("crypto");
            let expectedSignature = crypto.createHmac('sha256', `${process.env.RAZORPAY_KEY_SECRET}`)
                .update(body.toString())
                .digest('hex');

            // console.log("sig received ", details['payment[razorpay_signature]']);
            // console.log("sig generated ", expectedSignature);
            
            let response = { "signatureIsValid": false }

            if (expectedSignature === details['payment[razorpay_signature]']){
                response = { "signatureIsValid": true }
            }
            resolve(response);
            
        })
    }





}

