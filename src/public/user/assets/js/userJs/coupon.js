function applyCoupon(totalAmount) {
    const couponCode = document.getElementById('couponCode').value;

    $.ajax({
        url: '/apply-coupon',
        type: 'post',
        data: {
            couponCode: couponCode,
        }
    })
        .done((res) => {
            if (res.status) {
                document.getElementById('couponApplyFail').classList.add('d-none')
                document.getElementById('couponApplySuccess').classList.remove('d-none')
                document.getElementById('couponApplySuccess').innerHTML = res.message
                document.getElementById('discount').innerHTML = -res.discount
            
                document.getElementById('couponDiscount').value = res.discount
                document.getElementById('totalAmount').innerHTML = res.cart.totalAmount
            } else {
                document.getElementById('couponApplySuccess').classList.add('d-none')
                document.getElementById('couponApplyFail').classList.remove('d-none')
                document.getElementById('couponApplyFail').innerHTML = res.message


            }
        })
}