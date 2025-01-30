document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signup-form");
    const userNameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const mobileField = document.getElementById("phone");
    const passwordField = document.getElementById("password");

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const mobileRegex = /^\d{10}$/;
    const passRegX = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{4,}$/;

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            let isValid = true;

            const userName = userNameField.value.trim();
            const email = emailField.value.trim();
            const mobile = mobileField.value.trim();
            const password = passwordField.value.trim();

            // Validate Name
            if (userName === "" || userName === null) {
                e.preventDefault();
                document.getElementById("nameError").classList.remove('d-none');
                document.getElementById("nameError").innerHTML = "Name must be filled!";
                isValid = false;
            } else if (!userName.match(usernameRegex)) {
                e.preventDefault();
                document.getElementById("nameError").classList.remove('d-none');
                document.getElementById("nameError").innerHTML = "Invalid name!";
                isValid = false;
            } else {
                document.getElementById("nameError").classList.add('d-none');
            }

            // Validate Email
            if (email === "" || email === null) {
                e.preventDefault();
                document.getElementById("emailError").classList.remove('d-none');
                document.getElementById("emailError").innerHTML = "Email must be filled!";
                isValid = false;
            } else if (!email.match(emailRegX)) {
                e.preventDefault();
                document.getElementById("emailError").classList.remove('d-none');
                document.getElementById("emailError").innerHTML = "Invalid Email Address!";
                isValid = false;
            } else {
                document.getElementById("emailError").classList.add('d-none');
            }

            // Validate Mobile
            if (mobile === "" || mobile === null) {
                e.preventDefault();
                document.getElementById("mobileNumError").classList.remove('d-none');
                document.getElementById("mobileNumError").innerHTML = "Phone number must be filled!";
                isValid = false;
            } else if (!mobile.match(mobileRegex)) {
                e.preventDefault();
                document.getElementById("mobileNumError").classList.remove('d-none');
                document.getElementById("mobileNumError").innerHTML = "Invalid Phone Number!";
                isValid = false;
            } else {
                document.getElementById("mobileNumError").classList.add('d-none');
            }

            // Validate Password
            if (password === "" || password === null) {
                e.preventDefault();
                document.getElementById("passwordError").classList.remove('d-none');
                document.getElementById("passwordError").innerHTML = "Password must be filled!";
                isValid = false;
            } else if (!password.match(passRegX)) {
                e.preventDefault();
                document.getElementById("passwordError").classList.remove('d-none');
                document.getElementById("passwordError").innerHTML = "Password must contain at least 6 characters including one uppercase letter, one lowercase letter, one number, and one special character.";
                isValid = false;
            } else {
                document.getElementById("passwordError").classList.add('d-none');
            }

            // If any validation failed, prevent form submission
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});
