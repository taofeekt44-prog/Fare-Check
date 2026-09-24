document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // PROFILE IMAGE PREVIEW
    // =====================================

    const profilePicture = document.getElementById("profile_picture");
    const profilePreview = document.getElementById("profilePreview");
    const profilePlaceholder = document.getElementById("profilePlaceholder");

    if (profilePicture) {

        profilePicture.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) {
                return;
            }

            // Check file type
            if (!file.type.startsWith("image/")) {

                alert("Please select a valid image file.");

                this.value = "";

                return;
            }


            // Check file size
            const maxSize = 2 * 1024 * 1024;

            if (file.size > maxSize) {

                alert("Please choose an image smaller than 2MB.");

                this.value = "";

                return;
            }


            // Show preview
            const reader = new FileReader();

            reader.onload = function (event) {

                if (profilePreview) {

                    profilePreview.src = event.target.result;

                    profilePreview.classList.remove("hidden");

                }


                if (profilePlaceholder) {

                    profilePlaceholder.style.display = "none";

                }

            };

            reader.readAsDataURL(file);

        });

    }


    // =====================================
    // BIO CHARACTER COUNTER
    // =====================================

    const bio = document.getElementById("bio");
    const bioCount = document.getElementById("bioCount");

    if (bio && bioCount) {

        function updateBioCount() {

            bioCount.textContent = bio.value.length;

        }

        updateBioCount();

        bio.addEventListener(
            "input",
            updateBioCount
        );

    }


    // =====================================
    // PROFILE FORM
    // =====================================

    const profileForm = document.getElementById("profileForm");

    const saveButton = document.getElementById("saveButton");


    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                const username =
                    document.getElementById("username");

                const email =
                    document.getElementById("email");


                if (
                    username &&
                    username.value.trim() === ""
                ) {

                    event.preventDefault();

                    alert("Please enter a username.");

                    username.focus();

                    return;

                }


                if (
                    email &&
                    email.value.trim() === ""
                ) {

                    event.preventDefault();

                    alert("Please enter your email address.");

                    email.focus();

                    return;

                }


                // Prevent double submission

                if (saveButton) {

                    saveButton.disabled = true;

                    saveButton.textContent =
                        "Saving...";

                }

            }
        );

    }

});