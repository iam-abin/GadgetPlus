function deleteCoupon(couponId) {
    swal("Are you sure you want to delete this coupon?", {
        buttons: ["No", "Yes"],
    }).then((res) => {
        if (res) {
            $.ajax({
                url: "/admin/delete-coupon/" + couponId,
                type: "get",
            })
                .done((res) => {
                    if (res) {
                        swal("Successful", `${res.message}`, "success").then(
                            () => {
                                location.reload();
                            }
                        );
                    }
                })
                .fail((error) => {
                    console.error(error);
                });
        }
    });
}

function getCouponData(couponId) {
    $.ajax({
        url: "/admin/edit-coupon/" + couponId,
        type: "get",
    })
        .done((res) => {
            if (res) {
                document.getElementById("couponNme").value =
                    res.couponData.couponName;
                document.getElementById("couponAmont").value =
                    res.couponData.discount;
                document.getElementById("couponExpiring").value =
                    res.couponData.expiryDate;
                document.getElementById("couponIdd").value =
                    res.couponData._id;

                $("#editCoupon").modal("show");
            }
        })
        .fail((error) => {
            console.error(error);
        });
}
