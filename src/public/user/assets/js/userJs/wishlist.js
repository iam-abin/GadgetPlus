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