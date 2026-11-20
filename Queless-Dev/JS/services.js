
import { services } from "./data.js";

export function initServices() {
    const grid = document.getElementById("services-grid");
    const searchInput = document.getElementById("service-search");
    const filters = document.getElementById("category-filters");
    const count = document.getElementById("service-count");
    const emptyState = document.getElementById("empty-state");

    // This page module should only run on the services page.
    if (!grid || !searchInput || !filters) return;

    let activeCategory = "all";
    let searchTerm = "";

    function renderServices() {
        const filteredServices = services.filter(service => {
            const matchesCategory =
                activeCategory === "all" ||
                service.category === activeCategory;

            const searchableText = `
                ${service.name}
                ${service.description}
                ${service.location}
                ${service.category}
            `.toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        count.textContent =
            `${filteredServices.length} service${filteredServices.length === 1 ? "" : "s"} found`;

        emptyState.hidden = filteredServices.length > 0;

        grid.innerHTML = filteredServices.map(service => `
            <article class="service-card">
                <div class="service-card-top">
                    <div class="service-icon" aria-hidden="true">
                        ${service.icon}
                    </div>

                    <span class="status-badge status-${service.status}">
                        ${service.status}
                    </span>
                </div>

                <h3>${service.name}</h3>

                <p class="service-description">
                    ${service.description}
                </p>

                <p class="service-location">
                    📍 ${service.location}
                </p>

                <div class="service-metrics">
                    <div>
                        <span class="metric-label">Estimated wait</span>
                        <span class="metric-value">${service.waitTime} min</span>
                    </div>

                    <div>
                        <span class="metric-label">People waiting</span>
                        <span class="metric-value">${service.peopleWaiting}</span>
                    </div>
                </div>

                <div class="service-card-footer">
                    <span class="metric-label">Simulated data</span>

                    <a
                        class="service-details-link"
                        href="./service-details.html?id=${encodeURIComponent(service.id)}"
                    >
                        View details →
                    </a>
                </div>
            </article>
        `).join("");
    }

    // Search as the user types.
    searchInput.addEventListener("input", event => {
        searchTerm = event.target.value.trim().toLowerCase();
        renderServices();
    });

    // Change the selected category.
    filters.addEventListener("click", event => {
        const button = event.target.closest("[data-category]");

        if (!button) return;

        activeCategory = button.dataset.category;

        filters.querySelectorAll(".filter-btn").forEach(filter => {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        renderServices();
    });

    // Display all services when the page first loads.
    renderServices();
}
