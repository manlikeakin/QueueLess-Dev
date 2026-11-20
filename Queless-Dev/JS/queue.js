
import { services } from "./data.js";

import {
    getQueueByService,
    addQueue,
    removeQueue
} from "./storage.js";

export function initQueue() {
    const container = document.getElementById("queue-content");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("service");

    const service = services.find(item => item.id === serviceId);

    if (!service) {
        container.innerHTML = `
            <div class="queue-empty">
                <h2>Service not found</h2>
                <p>Please select a valid service before joining a queue.</p>
                <a href="./services.html" class="btn btn-primary">
                    Explore services
                </a>
            </div>
        `;
        return;
    }

    // Generate a unique ticket reference.
    function generateTicketId() {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return `QL-${randomNumber}`;
    }

    // Estimate the wait for one additional person.
    function calculateEstimatedWait() {
        const people = Math.max(service.peopleWaiting, 1);
        const averageWaitPerPerson = Math.ceil(service.waitTime / people);

        return service.waitTime + averageWaitPerPerson;
    }

    // Check whether the user already has an active ticket.
    let ticket = getQueueByService(service.id);

    // Create a new ticket if one doesn't already exist.
    if (!ticket) {
        const position = service.peopleWaiting + 1;

        const newTicket = {
            ticketId: generateTicketId(),
            serviceId: service.id,
            serviceName: service.name,
            position: position,
            estimatedWait: calculateEstimatedWait(),
            status: "waiting",
            createdAt: new Date().toISOString()
        };

        ticket = addQueue(newTicket);
    }

    if (!ticket) {
        container.innerHTML = `
            <div class="queue-empty">
                <h2>Unable to create your ticket</h2>
                <p>Your browser could not save the ticket. Please check your browser storage settings and try again.</p>
                <a href="./services.html" class="btn btn-primary">
                    Back to services
                </a>
            </div>
        `;
        return;
    }

    // Display the saved ticket.
    function renderTicket() {
        container.innerHTML = `
            <div class="queue-ticket">

                <div class="ticket-header">
                    <span class="ticket-label">QUEUE TICKET</span>
                    <span class="ticket-status">
                        ● Waiting
                    </span>
                </div>

                <div class="ticket-number">
                    ${ticket.ticketId}
                </div>

                <p class="ticket-service">
                    ${ticket.serviceName}
                </p>

                <div class="ticket-divider"></div>

                <div class="ticket-metrics">

                    <div class="ticket-metric">
                        <span>Your queue position</span>
                        <strong>#${ticket.position}</strong>
                    </div>

                    <div class="ticket-metric">
                        <span>Estimated waiting time</span>
                        <strong>${ticket.estimatedWait} min</strong>
                    </div>

                </div>

                <div class="ticket-information">
                    <h3>What happens next?</h3>
                    <p>
                        Keep your ticket reference safe. You can return to this
                        page to view your saved ticket.
                    </p>
                </div>

                <div class="ticket-actions">
                    <button id="leave-queue" class="btn btn-danger">
                        Leave queue
                    </button>

                    <a href="./services.html" class="btn btn-secondary">
                        Explore other services
                    </a>
                </div>

                <p class="ticket-demo-note">
                    Demonstration ticket. Queue position and waiting time
                    are simulated and do not update from a real service.
                </p>

            </div>
        `;

        const leaveButton = document.getElementById("leave-queue");

        leaveButton.addEventListener("click", leaveQueue);
    }

    // Remove the user's ticket.
    function leaveQueue() {
        const confirmed = window.confirm(
            "Are you sure you want to leave this virtual queue?"
        );

        if (!confirmed) return;

        const removed = removeQueue(ticket.ticketId);

        if (!removed) {
            window.alert("We couldn't remove your ticket. Please try again.");
            return;
        }

        container.innerHTML = `
            <div class="queue-empty">
                <h2>You have left the queue</h2>
                <p>Your virtual queue ticket has been removed from this browser.</p>
                <a href="./services.html" class="btn btn-primary">
                    Explore services
                </a>
            </div>
        `;
    }

    renderTicket();
}
