document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", function () {
            mobileMenu.classList.toggle("show");
        });
    }

    if (mobileMenu) {

        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("show");
            });
        });
    }


    const originInput = document.getElementById("origin");
    const destinationInput = document.getElementById("destination");
    const swapButton = document.getElementById("swapButton");
    if (originInput &&destinationInput && swapButton) {
        swapButton.addEventListener("click", function () {
            const temporary = originInput.value;
            originInput.value = destinationInput.value;
            destinationInput.value = temporary;
        });
    }
    const searchForm = document.querySelector(".route-search-box form");
    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            const origin = originInput.value.trim();
            const destination = destinationInput.value.trim();
            if (!origin || !destination) {
                event.preventDefault();
                alert(
                    "Please enter both your starting location and destination."
                );
                return;
            }
            if (origin.toLowerCase() === destination.toLowerCase()) {
                event.preventDefault();
                alert("Your starting location and destination cannot be the same.");
                return;
            }
        });
    }
});