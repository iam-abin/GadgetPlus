const paypal = require('paypal-rest-sdk');


paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': process.env.PAYPAL_CLIENT_ID, // please provide your client id here 
    'client_secret': process.env.PAYPAL_SECRET // provide your client secret here 
});


module.exports = {

    paypayPay: () => {
        return new Promise((resolve, reject) => {

            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/success",
                    "cancel_url": "http://localhost:3000/error"
                },
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": "1.00"
                    },
                    "description": "This is the payment description."
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            let link = payment.links[i].href
                            resolve(link);
                        }
                    }
                }
            });

        })
    }

}
