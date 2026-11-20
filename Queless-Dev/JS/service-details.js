
import { services } from "./data.js";

export function initServiceDetails() {
    const container = document.getElementById("service-details-content");

    if (!container) return;

    // Read the service ID from the URL.
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("id");

    // Find the selected service.
    const service = services.find(item => item.id === serviceId);

    // Handle invalid or missing service IDs.
    if (!service) {
        container.innerHTML = `
            <div class="details-not-found">
                <h2>Service not found</h2>
                <p>We couldn't find the service you're looking for.</p>
                <a href="./services.html" class="btn btn-primary">
                    Explore services
                </a>
            </div>
        `;
        return;
    }

    // Generate a recommendation using the estimated waiting time.
    function getRecommendation(waitTime) {
        if (waitTime <= 20) {
            return {
                status: "Go now",
                className: "recommendation-go",
                message: "The estimated waiting time is relatively low. This may be a good time to visit.",
                arrival: "Now"
            };
        }

        if (waitTime <= 45) {
            return {
                status: "Consider your timing",
                className: "recommendation-wait",
                message: "The queue is moderately busy. You may visit now if convenient, or check again before travelling.",
                arrival: "Check again in 30 minutes"
            };
        }

        return {
            status: "Consider visiting later",
            className: "recommendation-later",
            message: "The estimated waiting time is high. Consider delaying your visit and checking queue conditions again later.",
            arrival: "Check again in 60 minutes"
        };
    }

    const recommendation = getRecommendation(service.waitTime);

    // Render the selected service and its queue intelligence.
    container.innerHTML = `
        <div class="details-layout">

            <section class="details-main">

                <span class="details-category">
                    ${service.category}
                </span>

                <h1 class="details-title">
                    ${service.name}
                </h1>

                <p class="details-description">
                    ${service.description}
                </p>

                <p class="details-location">
                    📍 ${service.location}
                </p>

                <div class="queue-status-heading">
                    <h2>Current queue conditions</h2>

                    <span class="status-badge status-${service.status}">
                        ${service.status}
                    </span>
                </div>

                <div class="queue-metrics">

                    <div class="queue-metric">
                        <span>Estimated waiting time</span>
                        <strong>${service.waitTime} min</strong>
                    </div>

                    <div class="queue-metric">
                        <span>People waiting</span>
                        <strong>${service.peopleWaiting}</strong>
                    </div>

                </div>

                <p class="queue-explanation">
                    These figures are simulated demonstration data.
                    Actual waiting times may differ.
                </p>

            </section>

            <aside class="recommendation-panel">

                <span class="eyebrow">QUEUELESS INTELLIGENCE</span>

                <h2>Should you go now?</h2>

                <span class="recommendation-status ${recommendation.className}">
                    ${recommendation.status}
                </span>

                <p class="recommendation-message">
                    ${recommendation.message}
                </p>

                <div class="recommendation-arrival">
                    <span>Suggested next step</span>
                    <strong>${recommendation.arrival}</strong>
                </div>

                <a
                    href="./queue.html?service=${encodeURIComponent(service.id)}"
                    class="btn btn-primary queue-action"
                >
                    Join virtual queue
                </a>

                <p class="recommendation-note">
                    Demo recommendation based on simulated queue figures,
                    not a guaranteed prediction.
                </p>

            </aside>

        </div>
    `;
}
