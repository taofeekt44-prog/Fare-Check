// =============================
// MOBILE MENU
// =============================

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("show");

});


// =============================
// SWAP ORIGIN & DESTINATION
// =============================

const swapBtn = document.getElementById("swapBtn");

swapBtn.addEventListener("click", () => {

    const origin = document.getElementById("origin");
    const destination = document.getElementById("destination");

    const temporary = origin.value;

    origin.value = destination.value;
    destination.value = temporary;

});


// =============================
// SEARCH FORM
// =============================

const fareSearch = document.getElementById("fareSearch");

fareSearch.addEventListener("submit", function(event) {

    event.preventDefault();

    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const transport = document.getElementById("transport").value;


    if (!origin || !destination) {

        alert("Please enter both your origin and destination.");

        return;

    }


    console.log("Origin:", origin);
    console.log("Destination:", destination);
    console.log("Transport:", transport);


    /*
        LATER:

        This is where we will connect
        the search form to Django.

        Example idea:

        window.location.href =
            `/search/?origin=${origin}&destination=${destination}`;

    */


    alert(
        `Searching fares from ${origin} to ${destination}`
    );

});