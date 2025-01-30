function getCategory(categoryId) {
    $.ajax({
        url: "/admin/edit-productCategory/" + categoryId,
        type: "get",
    })
        .done((res) => {
            $("#editCategoryName").val(res.category.name);
            $("#editCategoryDescription").val(res.category.description);
            $("#editCategoryId").val(res.category._id);
            $("#myModal").modal("show");
        })
        .fail((err) => {
            swal("Error", `${err.responseJSON.message}`, "error");
        });
}

//add category

document
    .getElementById("addProductCategoryForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const categoryName = document.getElementById("addcategoryName").value;
        const categoryDescription = document.getElementById(
            "addcategoryDescription"
        ).value;

        let data = {
            categoryName: categoryName,
            categoryDescription: categoryDescription,
        };

        $.ajax({
            url: "/admin/add-productCategory",
            method: "post",
            data: data,
        })
            .then((res) => {
                if (res) {
                    document
                        .getElementById("categoryError")
                        .classList.add("d-none");
                    $("#exampleModal").modal("hide");
                    Toastify({
                        text: `category added successfully`,
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "green",
                        },
                    }).showToast();
                } else {
                    document
                        .getElementById("categoryError")
                        .classList.remove("d-none");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

//Edit category

document
    .getElementById("editProductCategoryForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const categoryName = document.getElementById("editCategoryName").value;
        const categoryDescription = document.getElementById(
            "editCategoryDescription"
        ).value;
        const categoryId = document.getElementById("editCategoryId").value;

        let data = {
            categoryName: categoryName,
            categoryDescription: categoryDescription,
            categoryId: categoryId,
        };

        fetch("/admin/edit-productCategoryPost", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    document
                        .getElementById("editCategoryError")
                        .classList.add("d-none");
                    $("#exampleModal").modal("hide");

                    Toastify({
                        text: `category Updated successfully`,
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "green",
                        },
                    }).showToast();

                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                } else {
                    document
                        .getElementById("editCategoryError")
                        .classList.remove("d-none");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });
