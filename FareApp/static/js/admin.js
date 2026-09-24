document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("adminSidebar");
    const openButton = document.getElementById("openSidebar");
    const closeButton = document.getElementById("closeSidebar");
    const overlay = document.getElementById("sidebarOverlay");


    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }


    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }


    if (openButton) {
        openButton.addEventListener("click", openSidebar);
    }


    if (closeButton) {
        closeButton.addEventListener("click", closeSidebar);
    }


    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }


    document.querySelectorAll(".admin-nav a").forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 800) {
                closeSidebar();
            }

        });

    });


    window.addEventListener("resize", function () {

        if (window.innerWidth > 800) {
            closeSidebar();
        }

    });

});