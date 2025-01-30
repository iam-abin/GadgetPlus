
$(document).ready(function () {
    $('#invoice').click((e) => {
        let orderDetails = JSON.parse(document.getElementById('orderDetails').value);
        let productDetails = JSON.parse(document.getElementById('productDetails').value);
        e.preventDefault();
        swal("do you want to download Invoice", {
            buttons: ['cancel', 'ok']
        })
            .then((res) => {
                if (res) {
                    const data = {
                        "documentTitle": "INVOICE GadgetPlus", // Title of the invoice
                        "currency": "INR",
                        "taxNotation": "GST", // VAT or GST
                        "marginTop": 25,
                        "marginRight": 25,
                        "marginLeft": 25,
                        "marginBottom": 25,
                        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", // URL or base64 encoded image
                        "sender": {
                            "company": "gadgetPlus",
                            "address": "Panampally Nagar",
                            "zip": "1234 AB",
                            "city": "Kochi",
                            "country": "India"
                        },
                        "client": {
                            "company": orderDetails.address.first_name,
                            "address": orderDetails.address.address,
                            "zip": "5678 CD",
                            "city": orderDetails.address.city,
                            "country": orderDetails.address.country
                        },
                        "invoiceNumber": "2021.0001",
                        "invoiceDate": "15-05-2023",
                        "products": productDetails.map((product) => ({
                            quantity: product.orderedItems.quantity,
                            description: product.orderedProduct.product_name,
                            tax: 0,
                            price: product.orderedProduct.product_price
                        }))
                        ,
                        "bottomNotice": "Thank you for your business."
                    };

                    //create invoice
                    easyinvoice.createInvoice(data, function (result) {
                        easyinvoice.download('gadgetPlus-invoice.pdf', result.pdf);
                    });

                }
            })
    })
})

function cancelOrder(userId,orderId){

    swal("do you want to Cancel This Order", {
        buttons: ['No', 'Yes']
    })
    .then((res)=>{
        if(res){
            $.ajax({
                url:'/cancel-order',
                method:'post',
                data:{
                    userId:userId,
                    orderId:orderId
                }
            })
            .done((res)=>{
                Toastify({
                        text: `${res.message}`,
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
                    location.reload()
            })
        }
    })
}


function returnOrder(userId,orderId){

    swal("do you want to Retrun This Order", {
        buttons: ['No', 'Yes']
    })
    .then((res)=>{
        if(res){
            $.ajax({
                url:'/return-order',
                method:'post',
                data:{
                    userId:userId,
                    orderId:orderId
                }
            })
            .done((res)=>{
                Toastify({
                        text: `${res.message}`,
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
                    location.reload()
            })
        }
    })
}