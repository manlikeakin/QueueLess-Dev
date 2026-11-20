
import {
    getServices,
    updateService,
    getQueues,
    getReports,
} from "./storage.js";

export function initDashboard() {
    const serviceContainer = document.getElementById("service-management");
    const reportContainer = document.getElementById("dashboard-reports");
    const analyticsContainer = document.querySelector(
        "#analytics .analytics-placeholder"
    );

    if (!serviceContainer || !reportContainer) return;

    // ==========================================
    // ELEMENTS
    // ==========================================

    const totalServices = document.getElementById("total-services");
    const activeQueues = document.getElementById("active-queues");
    const averageWait = document.getElementById("average-wait");
    const totalReports = document.getElementById("total-reports");
    const dashboardDate = document.getElementById("dashboard-date");

    // ==========================================
    // HELPERS
    // ==========================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    function getStatusLabel(status) {
        const labels = {
            low: "Low congestion",
            moderate: "Moderate",
            busy: "Busy",
            closed: "Closed"
        };

        return labels[status] || "Unknown";
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Unknown date";
        }

        return new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }).format(date);
    }

    function getCurrentServices() {
        return getServices().map(service => ({
            ...service,
            peopleWaiting: Number(service.peopleWaiting) || 0,
            waitTime: Number(service.waitTime) || 0
        }));
    }

    // ==========================================
    // DASHBOARD DATE
    // ==========================================

    if (dashboardDate) {
        dashboardDate.textContent = new Intl.DateTimeFormat("en", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    function renderStatistics() {
        const services = getCurrentServices();
        const queues = getQueues();
        const reports = getReports();

        const openServices = services.filter(
            service => service.status !== "closed"
        );

        const average = openServices.length
            ? Math.round(
                openServices.reduce((total, service) => {
                    return total + service.waitTime;
                }, 0) / openServices.length
            )
            : 0;

        if (totalServices) totalServices.textContent = services.length;
        if (activeQueues) activeQueues.textContent = queues.length;
        if (averageWait) averageWait.textContent = `${average} min`;
        if (totalReports) totalReports.textContent = reports.length;
    }

    // ==========================================
    // ANALYTICS: CONGESTION DISTRIBUTION
    // ==========================================

    function renderCongestionChart(services) {
        const statuses = [
            { key: "low", label: "Low congestion" },
            { key: "moderate", label: "Moderate" },
            { key: "busy", label: "Busy" },
            { key: "closed", label: "Closed" }
        ];

        const total = services.length;

        if (!total) {
            return `<p class="analytics-empty">No service data available yet.</p>`;
        }

        return statuses.map(status => {
            const count = services.filter(
                service => service.status === status.key
            ).length;

            const percentage = Math.round((count / total) * 100);

            return `
                <div class="congestion-row">
                    <div class="chart-label">
                        <span class="chart-status status-${status.key}">
                            ${status.label}
                        </span>
                        <strong>${count}</strong>
                    </div>

                    <div
                        class="chart-track"
                        role="progressbar"
                        aria-label="${status.label}"
                        aria-valuenow="${percentage}"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div
                            class="chart-fill fill-${status.key}"
                            style="width: ${percentage}%"
                        ></div>
                    </div>

                    <span class="chart-percentage">${percentage}%</span>
                </div>
            `;
        }).join("");
    }

    // ==========================================
    // ANALYTICS: WAITING-TIME COMPARISON
    // ==========================================

    function renderWaitingTimeChart(services) {
        const openServices = services
            .filter(service => service.status !== "closed")
            .sort((a, b) => b.waitTime - a.waitTime);

        if (!openServices.length) {
            return `<p class="analytics-empty">No open services to compare.</p>`;
        }

        const maximumWait = Math.max(
            ...openServices.map(service => service.waitTime),
            1
        );

        return openServices.map(service => {
            const percentage = Math.round(
                (service.waitTime / maximumWait) * 100
            );

            return `
                <div class="waiting-row">
                    <div class="waiting-row-heading">
                        <span>${escapeHTML(service.name)}</span>
                        <strong>${service.waitTime} min</strong>
                    </div>

                    <div
                        class="chart-track waiting-track"
                        role="progressbar"
                        aria-label="Estimated wait for ${escapeHTML(service.name)}"
                        aria-valuenow="${service.waitTime}"
                        aria-valuemin="0"
                        aria-valuemax="${maximumWait}"
                    >
                        <div
                            class="chart-fill fill-waiting"
                            style="width: ${percentage}%"
                        ></div>
                    </div>
                </div>
            `;
        }).join("");
    }

    // ==========================================
    // ANALYTICS: SERVICE PERFORMANCE
    // ==========================================

    function renderPerformanceOverview(services) {
        const openServices = services.filter(
            service => service.status !== "closed"
        );

        if (!openServices.length) {
            return `
                <div class="performance-card">
                    <span>Open services</span>
                    <strong>0</strong>
                    <p>There are currently no open services.</p>
                </div>
            `;
        }

        const busiestService = [...openServices].sort(
            (a, b) => b.peopleWaiting - a.peopleWaiting
        )[0];

        const longestWait = [...openServices].sort(
            (a, b) => b.waitTime - a.waitTime
        )[0];

        const fastestService = [...openServices].sort(
            (a, b) => a.waitTime - b.waitTime
        )[0];

        return `
            <div class="performance-card">
                <span>Most people waiting</span>
                <strong>${busiestService.peopleWaiting}</strong>
                <p>${escapeHTML(busiestService.name)}</p>
            </div>

            <div class="performance-card">
                <span>Longest estimated wait</span>
                <strong>${longestWait.waitTime} min</strong>
                <p>${escapeHTML(longestWait.name)}</p>
            </div>

            <div class="performance-card">
                <span>Shortest estimated wait</span>
                <strong>${fastestService.waitTime} min</strong>
                <p>${escapeHTML(fastestService.name)}</p>
            </div>
        `;
    }

    // ==========================================
    // RENDER ANALYTICS
    // ==========================================

    function renderAnalytics() {
        if (!analyticsContainer) return;
        analyticsContainer.classList.remove("analytics-placeholder");

        const services = getCurrentServices();

        analyticsContainer.innerHTML = `
            <div class="analytics-content">

                <div class="analytics-section-heading">
                    <div>
                        <h3>Current service conditions</h3>
                        <p>
                            A snapshot of congestion across all listed services.
                        </p>
                    </div>
                </div>

                <div class="analytics-grid">

                    <article class="analytics-panel">
                        <div class="analytics-panel-heading">
                            <div>
                                <h4>Congestion distribution</h4>
                                <p>Services grouped by current status</p>
                            </div>
                        </div>

                        <div class="congestion-chart">
                            ${renderCongestionChart(services)}
                        </div>
                    </article>

                    <article class="analytics-panel">
                        <div class="analytics-panel-heading">
                            <div>
                                <h4>Waiting-time comparison</h4>
                                <p>Estimated waiting time per open service</p>
                            </div>
                        </div>

                        <div class="waiting-chart">
                            ${renderWaitingTimeChart(services)}
                        </div>
                    </article>

                </div>

                <article class="analytics-panel performance-panel">
                    <div class="analytics-panel-heading">
                        <div>
                            <h4>Service performance overview</h4>
                            <p>Highlights based on current service information</p>
                        </div>
                    </div>

                    <div class="performance-grid">
                        ${renderPerformanceOverview(services)}
                    </div>
                </article>

                <p class="analytics-disclaimer">
                    These analytics are calculated from the service information
                    currently stored in this browser. They do not represent
                    historical trends or independently verified live data.
                </p>

            </div>
        `;
    }

    // ==========================================
    // SERVICE MANAGEMENT
    // ==========================================

    function renderServices() {
        const services = getCurrentServices();

        if (!services.length) {
            serviceContainer.innerHTML = `
                <div class="dashboard-empty">
                    <h3>No services available</h3>
                    <p>There are currently no services to manage.</p>
                </div>
            `;

            return;
        }

        serviceContainer.innerHTML = services.map(service => `
            <article class="managed-service">

                <div class="managed-service-info">
                    <div class="managed-service-icon">
                        ${escapeHTML(service.icon)}
                    </div>

                    <div>
                        <h3>${escapeHTML(service.name)}</h3>
                        <p>${escapeHTML(service.location)}</p>
                        <span class="status-badge status-${escapeHTML(service.status)}">
                            ${escapeHTML(getStatusLabel(service.status))}
                        </span>
                        <p class="service-last-updated">
    <span>Last updated:</span>
    ${escapeHTML(
        service.updatedAt
            ? formatDate(service.updatedAt)
            : "Not updated yet"
    )}
</p>
                    </div>
                </div>

                <form
                    class="service-update-form"
                    data-service-id="${escapeHTML(service.id)}"
                >

                    <label>
                        People waiting
                        <input
                            type="number"
                            name="peopleWaiting"
                            min="0"
                            max="10000"
                            value="${service.peopleWaiting}"
                            required
                        >
                    </label>

                    <label>
                        Estimated wait (minutes)
                        <input
                            type="number"
                            name="waitTime"
                            min="0"
                            max="1440"
                            value="${service.waitTime}"
                            required
                        >
                    </label>

                    <label>
                        Service status
                        <select name="status" required>
                            <option value="low" ${service.status === "low" ? "selected" : ""}>
                                Low congestion
                            </option>

                            <option value="moderate" ${service.status === "moderate" ? "selected" : ""}>
                                Moderate
                            </option>

                            <option value="busy" ${service.status === "busy" ? "selected" : ""}>
                                Busy
                            </option>

                            <option value="closed" ${service.status === "closed" ? "selected" : ""}>
                                Closed
                            </option>
                        </select>
                    </label>

                    <button type="submit" class="btn btn-primary btn-sm">
                        Save update
                    </button>

                    <p class="service-update-feedback" aria-live="polite"></p>

                </form>

            </article>
        `).join("");
    }

    // ==========================================
    // HANDLE SERVICE UPDATES
    // ==========================================

    serviceContainer.addEventListener("submit", event => {
        const form = event.target.closest(".service-update-form");

        if (!form) return;

        event.preventDefault();

        const serviceId = form.dataset.serviceId;
        const formData = new FormData(form);

        const peopleWaiting = Number(formData.get("peopleWaiting"));
        const waitTime = Number(formData.get("waitTime"));
        const status = formData.get("status");

        const validStatuses = ["low", "moderate", "busy", "closed"];

        if (
            !Number.isInteger(peopleWaiting) ||
            !Number.isInteger(waitTime) ||
            peopleWaiting < 0 ||
            peopleWaiting > 10000 ||
            waitTime < 0 ||
            waitTime > 1440 ||
            !validStatuses.includes(status)
        ) {
            alert("Please enter valid service information.");
            return;
        }

        const successful = updateService(serviceId, {
            peopleWaiting,
            waitTime,
            status
        });

        if (!successful) {
            alert("The service update could not be saved.");
            return;
        }

       renderDashboard();

const updatedForm = [
    ...serviceContainer.querySelectorAll(".service-update-form")
].find(form => form.dataset.serviceId === serviceId);

if (updatedForm) {
    const feedback = updatedForm.querySelector(
        ".service-update-feedback"
    );

    const saveButton = updatedForm.querySelector(
        'button[type="submit"]'
    );

    if (feedback) {
        feedback.textContent = "Service information saved successfully.";
        feedback.classList.add("is-visible");
    }

    if (saveButton) {
        saveButton.textContent = "Saved";
        saveButton.disabled = true;
    }
}
    });

    // ==========================================
    // COMMUNITY REPORTS
    // ==========================================

    function renderReports() {
        const reports = getReports().slice(0, 5);

        if (reports.length === 0) {
            reportContainer.innerHTML = `
                <div class="dashboard-empty">
                    <h3>No community reports yet</h3>
                    <p>Reports submitted by users will appear here.</p>
                </div>
            `;

            return;
        }

        const reportLabels = {
            long_queue: "Unusually long queue",
            temporarily_closed: "Temporarily closed",
            service_delay: "Service delays",
            low_crowd: "Low crowd / short queue",
            other: "Other observation"
        };

        reportContainer.innerHTML = reports.map(report => `
            <article class="dashboard-report">
                <div>
                    <h3>${escapeHTML(report.serviceName)}</h3>
                    <span>
                        ${escapeHTML(reportLabels[report.type] || "Other observation")}
                    </span>
                    <p>${escapeHTML(report.details)}</p>
                    <small>${escapeHTML(formatDate(report.createdAt))}</small>
                </div>

                <span class="unverified-badge">Unverified</span>
            </article>
        `).join("");
    }

    // ==========================================
    // INITIALIZE DASHBOARD
    // ==========================================

    function renderDashboard() {
        renderStatistics();
        renderServices();
        renderReports();
        renderAnalytics();
    }

    renderDashboard();
}
