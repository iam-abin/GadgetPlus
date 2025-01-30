// Users
function changeUserStatus(userId) {
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

// Product
function changeProductStatus(productId) {
    swal("Are you sure you want to do this?", {
        buttons: ["No!", "Yes!"],
    }).then((res) => {
        if (res) {
            $.ajax({
                url: "/admin/delete-product/" + productId,
                type: "get",
            })
                .done((res) => {
                    swal("successful", `${res.message}`, "success").then(
                        () => {
                            location.reload();
                        }
                    );
                })
                .fail((err) => {
                    swal("successful", `${res.message}`, "success").then(
                        () => {
                            location.reload();
                        }
                    );
                });
        }
    });
}

// Category
function deleteACategory(categoryId) {
    swal("Are you sure you want to delete this", {
      buttons: ["cancel", "ok"],
    }).then((res) => {
      if (res) {
        $.ajax({
          url: "/admin/delete-productCategory/" + categoryId,
          type: "get",
        }).done((res) => {
          if (res) {
            if (res.listed) {  //to show green button and green toast message

              Toastify({
                text: `${res.message}`,
                duration: 3000,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "green",
                },
              }).showToast();

              const button = document.getElementById(
                "delete-category" + categoryId
              );
              document.getElementById("delete-category" + categoryId).classList.remove("btn-danger");
              document.getElementById("delete-category" + categoryId).classList.add("btn-success");
              button.innerHTML = "Listed";
            } else {

              Toastify({
                text: `${res.message}`,
                duration: 3000,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "red",
                },
              }).showToast();

              const button = document.getElementById("delete-category" + categoryId);
              document.getElementById("delete-category" + categoryId).classList.add("btn-danger");
              document.getElementById("delete-category" + categoryId).classList.remove("btn-success");
              button.innerHTML = "UnListed";
            }
          }
        });
      }
    });
  }