 // To add product to wish list
 $(document).ready(function () {
    $('.add-to-Wishlist').click(function (e) {
        e.preventDefault();
        const productId = $(this).data('value');
        $.ajax({
            url: '/add-to-wishList',
            type: 'post',
            data: { productId: productId }
        })
            .done((res) => {
                swal("successfull", `${res.message}`, "success")
                    .then(() => {
                        location.reload()
                    })
            })
            .fail((err) => {
                console.error(err);
            })
    })
})

function removeFromWishList(productId) {
    $.ajax({
        url: '/remove-from-wishList',
        type: 'post',
        data: {
            productId: productId
        }
    })
        .then((res) => {
            iziToast.success({
                title: 'OK',
                message: `${res.message}`,
                position: 'topRight',
                onOpening: function (instance, toast) {
                    // Modify the top property to adjust the message position
                    toast.style.top = '80px'; // Adjust the value as needed to move the message down
                }
            })
            $('#wishlist-card-' + productId).remove()
            document.getElementById('wishListCount').innerHTML = `${res.wishListCount}`;
        })
        .fail((error) => {
            console.error(error);
        })
}

$(document).ready(function () {
    $('.remove-produtFromWishlist').click(function (e) {
        e.preventDefault();
        const productId = $(this).data('value');
        $.ajax({
            url: '/add-to-wishList',
            type: 'post',
            data: { productId: productId }
        })
            .done((res) => {
                swal("successfull", `${res.message}`, "success")
                    .then(() => {
                        location.reload()
                    })
            })
            .fail((err) => {
                console.error(err);
            })
    })
})