  // column name in the google sheet are creating based on the name attribute of the input fields.
  $("#submit-form").submit((e) => {
    let submitButton = document.getElementById("submit-btnn");
    submitButton.disabled = true;
    e.preventDefault();
    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbwTeIwaeA2Z5VKtTnY5npIX3EpWgDKo-cn58lJMQuSfJXGEn-Gzz6yxuGooXOlIbuAP/exec",
        data: $("#submit-form").serialize(),
        method: "post",
        success: function (response) {
            swal(
                "successfull",
                "Form submitted successfully",
                "success"
            ).then(() => {
                location.reload();
                submitButton.disabled = false;
            });
        },
        error: function (err) {
            alert("Something Error");
        },
    });
});