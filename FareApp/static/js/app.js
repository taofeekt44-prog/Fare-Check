// alert("THIS IS THE NEW AUTH.JS");
function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
    } else {
        input.type = "password";
        button.textContent = "Show";
    }
}


/* REGISTER VALIDATION */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const error = document.getElementById("confirmPasswordError");

        if (password !== confirmPassword) {

            event.preventDefault();

            error.textContent = "Passwords do not match.";

            return;
        }

        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

        if (!passwordRegex.test(password)) {

            event.preventDefault();

            error.textContent =
                "Password must be at least 8 characters and contain a letter, a number, and a special character.";

            return;
        }

        error.textContent = "";

        // Nothing else here.
        // The form will submit normally to Django.
    });
}

/* LOGIN VALIDATION */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        
        if (!email || !password) {
            // event.preventDefault();
            alert("Please enter your email and password.");

            return;
        }


        // alert("Login successful!");

    });
}