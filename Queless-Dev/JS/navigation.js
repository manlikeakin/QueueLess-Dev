
/* =========================================
   QUEUELESS NAVIGATION CONTROLLER
========================================= */

/**
 * Initializes the shared navigation system.
 */

export function initNavigation() {

    const navbar = document.querySelector(".navbar");

    const menuToggle = document.getElementById("menu-toggle");

    const navMenu = document.getElementById("nav-menu");

    const navLinks = document.querySelectorAll(".nav-link");


    // Stop if the navbar has not been rendered.

    if (!navbar || !menuToggle || !navMenu) {
        return;
    }


    /**
     * Opens and closes the mobile menu.
     */

    function toggleMenu() {

        const isOpen = navMenu.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    }


    /**
     * Closes the mobile menu.
     */

    function closeMenu() {

        navMenu.classList.remove("open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Open navigation menu");

    }


    // Mobile menu interaction.

    menuToggle.addEventListener("click", toggleMenu);


    // Close menu after selecting a navigation link.

    navLinks.forEach(link => {

        link.addEventListener("click", closeMenu);

    });


    // Close menu when the user presses Escape.

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    // Close menu if the user clicks outside it.

    document.addEventListener("click", event => {

        if (
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }

    });


    // Add shadow when scrolling.

    function handleScroll() {

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    handleScroll();


    // Highlight the active page.

    const currentPage = document.body.dataset.page;

    navLinks.forEach(link => {

        if (link.dataset.nav === currentPage) {

            link.classList.add("active");

            link.setAttribute("aria-current", "page");

        } else {

            link.classList.remove("active");

            link.removeAttribute("aria-current");

        }

    });


    // Close the mobile menu when returning to desktop.

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {
            closeMenu();
        }

    });

}
