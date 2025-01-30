
$(document).ready(function () {
    $('#checkout-form').submit((e) => {
        e.preventDefault();
        $.ajax({
            url: '/place-order',
            type: 'post',
            data: $('#checkout-form').serialize()
        })
            .done((response) => {
                    switch (response.paymentMethod) {
                        case 'COD':
                            location.href = "/order-success"
                            break;

                        case 'razorpay':
                            paymentMethodrazorpayPayment(response);
                            break;
                        case 'wallet':
                            location.href = "/order-success"
                            break;

                    }

                // }
            })
            .fail((error) => {
                console.error(error);
                Toastify({
                        text: `${error.responseJSON.message || "something went wrong"}`,
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "center", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },

                    }).showToast();
            })
    })
})


function paymentMethodrazorpayPayment(orderinfo) {
    const options = {

        "key": `${orderinfo.razorpaykeyId}`, // Enter the Key ID generated from the Dashboard
        "amount": orderinfo.razorpayOrderDetails.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "gadgetPlus",  //your business name
        "description": "Test Transaction",
        "image": "/user/assets/images/logo/logo.png",
        "order_id": `${orderinfo.razorpayOrderDetails.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPaymentSignature(response, orderinfo.orderDetails, orderinfo.razorpayOrderDetails);

        },
        "prefill": {
            "name": "abin varghese",
            "email": "abinvarghese@gmail.com",
            "contact": "8934327744"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();

}


function verifyPaymentSignature(payment, orderDetails, razorpayOrderDetails) {
    $.ajax({
        url: '/verify-payment',
        method: 'post',
        data: {
            payment,
            orderDetails,
            razorpayOrderDetails
        },
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Good job!",
                    text: "Payment successfull!",
                    icon: "success",
                    button: "Ok!",
                })
                    .then(() => {
                        location.href = '/order-success'
                    })
            } else {
                swal({
                    title: "sorry!",
                    text: "Payment failed",
                    icon: "error",
                    button: "Ok!",
                })
                    .then(() => {
                        location.href = '/cart'
                    })
            }
        }


    })
}