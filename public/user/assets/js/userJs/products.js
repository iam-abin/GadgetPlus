$(document).ready(function () {
    $('.add-to-cart').click(function (e) {
        e.preventDefault()
        const prodId = $(this).data('value')
        console.log('clicked', prodId)
        $.ajax({
            url: '/add-to-cart/' + prodId,
            type: 'get'
        })
            .done((res) => {
                console.log(res);
                console.log("abi");
                swal("successfull", `${res.message}`, "success")
                    .then(() => {
                        location.reload()
                    })
            })
            .fail((err) => {
                console.log(err);
            })
    })
})


$(document).ready(function () {
    $('.add-to-Wishlist').click(function (e) {
        e.preventDefault();
        const productId = $(this).data('value');
        console.log("clicked");
        console.log("hjjjjjjjjjj", productId);
        $.ajax({
            url: '/add-to-wishList',
            type: 'post',
            data: { productId: productId }
        })
            .done((res) => {
                console.log(res.message);
                swal("successfull", `${res.message}`, "success")
                    .then(() => {
                        location.reload()
                    })
            })
            .fail((err) => {
                console.log(err);
            })
    })
})