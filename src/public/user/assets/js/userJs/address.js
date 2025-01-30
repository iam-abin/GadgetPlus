
$(document).ready(function () {
    $('#add-address-form').submit((e) => {
        e.preventDefault();
        $.ajax({
            url: '/add-address',
            type: 'post',
            data: $('#add-address-form').serialize()
        })
            .done((res) => {
                swal({
                    title: "Success",
                    text: "New Address added.",
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    location.reload();
                })
            })
            .fail((err) => {
                console.error(err);
            })
    })
})


function getAddress(addressId){
    $.ajax({
        url:'/edit-address/'+addressId,
        type:'get',

    }).done((res)=>{
        document.getElementById('addressId').value=res.address._id;
        document.getElementById('fname').value=res.address.first_name;
        document.getElementById('lname').value=res.address.last_name;
        document.getElementById('mobile').value=res.address.mobile;
        document.getElementById('email').value=res.address.email_id;
        document.getElementById('address').value=res.address.address;
        document.getElementById('country').value=res.address.country;
        document.getElementById('state').value=res.address.state;
        document.getElementById('city').value=res.address.city;
        document.getElementById('pincode').value=res.address.pincode;
    })
    .fail((error)=>{
        console.error(error);
    })
}


$(document).ready(function () {
    $('#edit-address-form').submit((e) => {
        e.preventDefault();
        $.ajax({
            url: '/edit-address',
            type: 'post',
            data: $('#edit-address-form').serialize()
        })
            .done((res) => {
                swal({
                    title: "Success",
                    text: "Address Updated.",
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    location.reload()
                })
            })
            .fail((err) => {
                console.error(err);
            })
    })
})

	function deleteAddress(addressId) {

		swal("are You sure", {
			buttons: ["No", "yes"]
		})
			.then((res) => {
				if (res) {
					$.ajax({
						url: '/delete-address/' + addressId,
						method: "post",
					})
						.then((response) => {
							if (response) {
								iziToast.success({
									title: 'OK',
									message: `${response.message}`,
									position: 'topRight',
									onOpening: function (instance, toast) {
										// Modify the top property to adjust the message position
										toast.style.top = '80px'; // Adjust the value as needed to move the message down
									}
								});
							}

							$(`#card-${addressId}`).remove()
						})
						.fail((error) => {
							console.error(error);

						})
				}
			})
	}

	// =============================================================================