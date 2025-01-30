$("#wallet-details").on("click", function (e) {
    e.preventDefault();
    $.ajax({
        url: "/wallet",
        method: "get",
    }).then((res) => {
        document.getElementById("walletAmount").innerHTML =
            "Your wallet balance is : " + res.walletDetails;

        $("#walletModal").modal("show");
    });
});