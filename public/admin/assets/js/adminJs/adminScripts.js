function changeUserStatus(userId) {
    console.log('clicked', userId)

    swal("Are you sure you want to do this?", {
        buttons: ["No!", "Yes!"],
    }).then((res) => {
        if (res) {
            $.ajax({
                url: '/admin/block-unBlock-user/' + userId,
                type: 'get'
            }).done(res => {
                swal("Successfull", `${res.message}`, "success").then(() => {
                    location.reload();
                })
            }).fail((err) => {
                swal("Successfull", `${err.responseJSON.message}`, "success").then(() => {
                    location.reload();
                })
            })
        }
    })
}