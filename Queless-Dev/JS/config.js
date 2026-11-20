
/* =========================================
   QUEUELESS APPLICATION CONFIGURATION
========================================= */

/**
 * Determines whether the current page is
 * inside the pages directory.
 */

const isPagesDirectory = window.location.pathname
    .split("/")
    .includes("pages");

/**
 * Generates the correct path to application
 * pages, regardless of the current directory.
 */

export const routes = {
    home: isPagesDirectory ? "../index.html" : "./index.html",

    services: isPagesDirectory
        ? "./services.html"
        : "./pages/services.html",

    dashboard: isPagesDirectory
        ? "./dashboard.html"
        : "./pages/dashboard.html",

    about: isPagesDirectory
        ? "./about.html"
        : "./pages/about.html",

        report: isPagesDirectory ? "./report.html" : "./pages/report.html"
};


/**
 * Generates paths to images, logos and icons.
 */

export function assetUrl(path) {
    const base = isPagesDirectory ? "../" : "./";

    return `${base}assets/${path}`;
}
