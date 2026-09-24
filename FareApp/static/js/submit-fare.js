document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    const form = document.getElementById("fareForm");

    const origin = document.getElementById("origin");
    const destination = document.getElementById("destination");
    const amount = document.getElementById("amount");

    const submitButton = document.getElementById("submitButton");
    const submitText = document.getElementById("submitText");
    const submitLoading = document.getElementById("submitLoading");

    const formError = document.getElementById("formError");

    if (menuButton) {

        menuButton.addEventListener("click", function () {

            mobileMenu.classList.toggle("show");

        });

    }

    function cleanLocation(value) {

        return value
            .trim()
            .replace(/\s+/g, " ");

    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        formError.style.display = "none";
        formError.textContent = "";


        const originValue = cleanLocation(origin.value);
        const destinationValue = cleanLocation(destination.value);
        const amountValue = Number(amount.value);


        /* Route validation */

        if (originValue.length < 2) {

            showError(
                "originError",
                "Please enter your starting location."
            );

            origin.focus();

            return;
        }


        if (destinationValue.length < 2) {

            showError(
                "destinationError",
                "Please enter your destination."
            );

            destination.focus();

            return;
        }


        if (
            originValue.toLowerCase() ===
            destinationValue.toLowerCase()
        ) {

            showFormError(
                "Your starting location and destination cannot be the same."
            );

            return;
        }


        /* Transport validation */

        const selectedTransport =
            document.querySelector(
                'input[name="transport_type"]:checked'
            );


        if (!selectedTransport) {

            showError(
                "transportError",
                "Please select a transport type."
            );

            return;
        }


        /* Amount validation */

        if (!amountValue || amountValue <= 0) {

            showError(
                "amountError",
                "Please enter a valid fare amount."
            );

            amount.focus();

            return;
        }


        /* Very large amount warning */

        if (amountValue > 1000000) {

            showFormError(
                "Please check the fare amount before submitting."
            );

            amount.focus();

            return;
        }


        /* Put cleaned values back into form */

        origin.value = originValue;
        destination.value = destinationValue;


        /* Prevent double submission */

        submitButton.disabled = true;

        submitText.style.display = "none";
        submitLoading.style.display = "inline";


        /*
         * Now allow the normal Django POST request.
         */

        form.submit();

    });


    function showError(elementId, message) {

        const element =
            document.getElementById(elementId);

        if (element) {

            element.textContent = message;

        }

    }


    function showFormError(message) {

        formError.textContent = message;

        formError.style.display = "block";

    }


    origin.addEventListener("input", function () {

        document.getElementById(
            "originError"
        ).textContent = "";

    });


    destination.addEventListener("input", function () {

        document.getElementById(
            "destinationError"
        ).textContent = "";

    });


    amount.addEventListener("input", function () {

        document.getElementById(
            "amountError"
        ).textContent = "";

    });

    document.querySelectorAll(
        'input[name="transport_type"]'
    ).forEach(function (radio) {

        radio.addEventListener("change", function () {

            document.getElementById(
                "transportError"
            ).textContent = "";

        });

    });

});