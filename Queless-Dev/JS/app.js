
import { renderNavbar, renderFooter } from "./components.js";
import { initNavigation } from "./navigation.js";
import { initServices } from "./services.js";
import { initServiceDetails } from "./service-details.js";
import { initQueue } from "./queue.js";
import { initDashboard } from "./dashboard.js";
import { initReports } from "./reports.js";

function initApp() {
    console.log("Initializing QueueLess...");

    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");

    if (header) {
        header.innerHTML = renderNavbar();
    }

    if (footer) {
        footer.innerHTML = renderFooter();
    }

   initNavigation();
initServices();
initServiceDetails();
initQueue();
initReports();
initDashboard();

    console.log("QueueLess is ready!");
}

initApp();
