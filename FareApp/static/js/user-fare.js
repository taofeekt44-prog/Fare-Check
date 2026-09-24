document.addEventListener("DOMContentLoaded", function () {

    /* ================= MOBILE MENU ================= */

    const menuButton = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");


    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", function () {

            mobileMenu.classList.toggle("show");

        });

    }



    /* ================= SEARCH & FILTER ================= */

    const searchInput = document.getElementById("fareSearch");
    const transportFilter = document.getElementById("transportFilter");

    const fareCards = document.querySelectorAll(".fare-card");

    const noResults = document.getElementById("noResults");
    const fareCount = document.getElementById("fareCount");


    function filterFares() {

        const searchValue =
            searchInput.value.trim().toLowerCase();

        const selectedTransport =
            transportFilter.value;

        let visibleCount = 0;


        fareCards.forEach(function (card) {

            const route =
                card.dataset.route || "";

            const transport =
                card.dataset.transport || "";


            const matchesSearch =
                route.includes(searchValue);


            const matchesTransport =
                selectedTransport === "ALL" ||
                transport === selectedTransport;


            if (matchesSearch && matchesTransport) {

                card.style.display = "block";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        /* Show / hide no results message */

        if (visibleCount === 0 && fareCards.length > 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }


        /* Update count */

        if (fareCount) {

            fareCount.textContent =
                `${visibleCount} submission${visibleCount === 1 ? "" : "s"}`;

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterFares
        );

    }


    if (transportFilter) {

        transportFilter.addEventListener(
            "change",
            filterFares
        );

    }

});