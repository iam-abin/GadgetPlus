$(document).ready(function () {
    let submitButton = document.getElementsByClassName('add-to-cart')
    $('.add-to-cart').click(function (e) {
        e.preventDefault()
        // Disable the submit button
        // $('.add-to-cart').prop('disabled', true);
        submitButton.disabled = true;
        const prodId = $(this).data('value')
        $.ajax({
            url: '/add-to-cart/' + prodId,
            type: 'post'
        })
            .done((res) => {
                swal("successfull", `${res.message}`, "success")
                    .then(() => {
                        location.reload()
                    })
                    // $('.add-to-cart').prop('disabled', false);
            })
            .fail((err) => {
                console.error(err);
            })
    })
})


function productRemove(productId, cartId) {
    swal("Do you want to remove this item from cart?", {
        buttons: ["No", "yes"],
    }).then((res) => {
        if (res) {
            $.ajax({
                url: "/remove-cart-item/" + productId,
                data: {
                    cartId: cartId,
                },
                type: "post",
            })
                .done((res) => {
                    if (res) {
                        $(`#item-${productId}`).remove();
                        iziToast.success({
                            title: "OK",
                            message: `${res.message}`,
                            position: "topRight",
                            onOpening: function (instance, toast) {
                                // Modify the top property to adjust the message position
                                toast.style.top = "80px"; // Adjust the value as needed to move the message down
                            },
                        });
                        document.getElementById("totalAmount").innerHTML =
                            res.totalAmount;
                        document.getElementById("cart-count").innerHTML =
                            res.cartCount;

                        if (res.cartCount == 0) {
                            location.reload();
                        }
                    }
                })
                .fail((error) => {
                    console.error(error);
                });
        }
    });
}

function incDecQuantity(productId, cartId, number, price) {
    $.ajax({
        url: "/quantity-change",
        type: "post",
        data: {
            quantity: number,
            cartId: cartId,
            productId: productId,
        },
    }).done((res) => {
        if (res) {
            if (!res.OutOfStock) {
                document.getElementById("incDec" + productId).innerHTML =
                    res.message.quantity;
                document.getElementById("totalAmount").innerHTML =
                    res.message.totalAmount;
                document
                    .getElementById("outOfStock" + productId)
                    .classList.add("d-none");
                let total = res.message.quantity * price;
                document.getElementById(
                    "productPrice" + productId
                ).innerHTML = total.toLocaleString("en-in", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                });
            } else {
                document.getElementById("incDec" + productId).innerHTML =
                    res.message.quantity;
                document.getElementById("totalAmount").innerHTML =
                    res.message.totalAmount;
                document
                    .getElementById("outOfStock" + productId)
                    .classList.remove("d-none");
                let total = res.message.quantity * price;
                document.getElementById(
                    "productPrice" + productId
                ).innerHTML = total.toLocaleString("en-in", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                });
            }
        }
    });
}