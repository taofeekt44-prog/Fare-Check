document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("fareSearch");

    const transportFilter =
        document.getElementById("transportFilter");

    const fareCards =
        document.querySelectorAll(".fare-card");

    const resultCount =
        document.getElementById("resultCount");

    const noResults =
        document.getElementById("noResults");

    const routeCount =
        document.getElementById("routeCount");


    /*
        COUNT UNIQUE ROUTES
    */

    const routes = new Set();

    fareCards.forEach(function (card) {

        const searchText =
            card.dataset.search;

        routes.add(searchText);

    });

    /*
        We calculate the actual route count
        from the route information on the cards.
    */

    const routeNames = new Set();

    fareCards.forEach(function (card) {

        const route =
            card.querySelector(".route-area h3");

        if (route) {
            routeNames.add(
                route.textContent.trim()
            );
        }

    });

    routeCount.textContent =
        routeNames.size;



    /*
        SEARCH + FILTER
    */

    function filterFares() {

        const searchValue =
            searchInput.value
                .trim()
                .toLowerCase();

        const transportValue =
            transportFilter.value
                .toLowerCase();


        let visible = 0;


        fareCards.forEach(function (card) {

            const searchData =
                card.dataset.search
                    .toLowerCase();

            const transport =
                card.dataset.transport
                    .toLowerCase();


            const matchesSearch =
                searchData.includes(searchValue);


            const matchesTransport =
                transportValue === "all" ||
                transport === transportValue;


            if (
                matchesSearch &&
                matchesTransport
            ) {

                card.style.display = "";

                visible++;

            } else {

                card.style.display = "none";

            }

        });


        /*
            UPDATE RESULT COUNT
        */

        resultCount.textContent =
            visible +
            (visible === 1
                ? " report"
                : " reports");


        /*
            NO RESULTS
        */

        if (visible === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }


    searchInput.addEventListener(
        "input",
        filterFares
    );


    transportFilter.addEventListener(
        "change",
        filterFares
    );

});