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