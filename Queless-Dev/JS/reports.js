
import { services } from "./data.js";
import { addReport, getReports } from "./storage.js";

export function initReports() {
    const form = document.getElementById("report-form");
    const serviceSelect = document.getElementById("report-service");
    const feedback = document.getElementById("report-feedback");
    const reportsContainer = document.getElementById("recent-reports");
    const reportCount = document.getElementById("report-count");

    // Only run on the reporting page.
    if (!form || !serviceSelect || !reportsContainer) return;

    const reportLabels = {
        long_queue: "Unusually long queue",
        temporarily_closed: "Temporarily closed",
        service_delay: "Service delays",
        low_crowd: "Low crowd / short queue",
        other: "Other observation"
    };

    // Populate the service dropdown using our shared data.
    services.forEach(service => {
        const option = document.createElement("option");

        option.value = service.id;
        option.textContent = service.name;

        serviceSelect.appendChild(option);
    });

    // Convert a timestamp into a readable date.
    function formatDate(dateString) {
        return new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }).format(new Date(dateString));
    }

    // Escape text before inserting user-submitted content into HTML.
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => {
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

    // Display the latest community reports.
    function renderReports() {
        const reports = getReports();

        reportCount.textContent =
            `${reports.length} report${reports.length === 1 ? "" : "s"}`;

        if (reports.length === 0) {
            reportsContainer.innerHTML = `
                <div class="no-reports">
                    <h3>No reports yet</h3>
                    <p>Be the first to share an observation with the community.</p>
                </div>
            `;
            return;
        }

        reportsContainer.innerHTML = reports.map(report => `
            <article class="community-report">

                <div class="community-report-top">
                    <h3>${escapeHTML(report.serviceName)}</h3>
                    <span class="unverified-badge">Unverified</span>
                </div>

                <span class="report-type-label">
                    ${escapeHTML(reportLabels[report.type] || "Other observation")}
                </span>

                <p>${escapeHTML(report.details)}</p>

                <small>
                    Submitted ${escapeHTML(formatDate(report.createdAt))}
                </small>

            </article>
        `).join("");
    }

    // Process form submissions.
    form.addEventListener("submit", event => {
        event.preventDefault();

        const serviceId = serviceSelect.value;
        const reportType = document.getElementById("report-type").value;
        const details = document.getElementById("report-details").value.trim();

        const selectedService = services.find(
            service => service.id === serviceId
        );

        if (!selectedService || !reportLabels[reportType] ||
            details.length < 5 || details.length > 500) {

            feedback.textContent =
                "Please select a valid service and report type, and enter between 5 and 500 characters.";

            feedback.className = "report-feedback error";
            return;
        }

        const report = {
            id: crypto.randomUUID(),
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            type: reportType,
            details: details,
            createdAt: new Date().toISOString(),
            verificationStatus: "unverified"
        };

        const savedReport = addReport(report);

        if (!savedReport) {
            feedback.textContent =
                "Your report could not be saved. Please try again.";

            feedback.className = "report-feedback error";
            return;
        }

        feedback.textContent =
            "Thank you! Your community report has been submitted.";

        feedback.className = "report-feedback success";

        form.reset();

        renderReports();
    });

    // Display saved reports when the page loads.
    renderReports();
}
