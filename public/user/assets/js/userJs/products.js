$(document).ready(function () {

    let submitButton = document.getElementsByClassName('add-to-cart')
    console.log(submitButton, "add-to-cart submitButton");
    $('.add-to-cart').click(function (e) {
        e.preventDefault()
        // Disable the submit button
        // $('.add-to-cart').prop('disabled', true);
        submitButton.disabled = true;
        const prodId = $(this).data('value')
        console.log('clicked', prodId)
        $.ajax({
            url: '/add-to-cart/' + prodId,
            type: 'post'
        })
            .done((res) => {
                console.log(res);
                console.log("abi");
                swal("successfull", `${res.message}`, "success")
                    .then(() => {
                        location.reload()
                    })
                    // $('.add-to-cart').prop('disabled', false);
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