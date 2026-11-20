

import { services } from "./data.js";

const QUEUE_STORAGE_KEY = "queueless_active_queues";

// Retrieve all saved queue tickets.
export function getQueues() {
    try {
        const savedQueues = localStorage.getItem(QUEUE_STORAGE_KEY);
        return savedQueues ? JSON.parse(savedQueues) : [];
    } catch (error) {
        console.error("Could not read saved queues:", error);
        return [];
    }
}

// Save all queue tickets.
export function saveQueues(queues) {
    try {
        localStorage.setItem(
            QUEUE_STORAGE_KEY,
            JSON.stringify(queues)
        );

        return true;
    } catch (error) {
        console.error("Could not save queues:", error);
        return false;
    }
}

// Retrieve a ticket using its service ID.
export function getQueueByService(serviceId) {
    const queues = getQueues();

    return queues.find(queue => queue.serviceId === serviceId) || null;
}

// Add a new ticket.
export function addQueue(queue) {
    const queues = getQueues();

    // Prevent duplicate active tickets for the same service.
    const existingQueue = queues.find(
        item => item.serviceId === queue.serviceId
    );

    if (existingQueue) {
        return existingQueue;
    }

    queues.push(queue);

    if (!saveQueues(queues)) {
        return null;
    }

    return queue;
}

// Remove a ticket.
export function removeQueue(ticketId) {
    const queues = getQueues();

    const updatedQueues = queues.filter(
        queue => queue.ticketId !== ticketId
    );

    return saveQueues(updatedQueues);
}


// ==========================================
// SERVICE UPDATE STORAGE
// ==========================================

const SERVICE_STORAGE_KEY = "queueless_service_updates";

// Get saved service updates
export function getServiceUpdates() {
    try {
        const savedUpdates = localStorage.getItem(SERVICE_STORAGE_KEY);

        return savedUpdates ? JSON.parse(savedUpdates) : {};
    } catch (error) {
        console.error("Could not read service updates:", error);
        return {};
    }
}

// Save service updates
export function saveServiceUpdates(updates) {
    try {
        localStorage.setItem(
            SERVICE_STORAGE_KEY,
            JSON.stringify(updates)
        );

        return true;
    } catch (error) {
        console.error("Could not save service updates:", error);
        return false;
    }
}

// Get the latest version of all services
export function getServices() {
    const updates = getServiceUpdates();

    return services.map(service => ({
        ...service,
        ...(updates[service.id] || {})
    }));
}

// Update a particular service

export function updateService(serviceId, newData) {
    const service = services.find(item => item.id === serviceId);

    if (!service) return false;

    const updates = getServiceUpdates();

    updates[serviceId] = {
        ...(updates[serviceId] || {}),
        ...newData,
        updatedAt: new Date().toISOString()
    };

    const successful = saveServiceUpdates(updates);

    if (!successful) return false;

    addActivity({
        type: "service_update",
        serviceName: service.name,
        message: `${service.name} service information was updated.`
    });

    return true;
}




// ==========================================
// COMMUNITY REPORT STORAGE
// ==========================================

const REPORT_STORAGE_KEY = "queueless_community_reports";

// Retrieve all community reports
export function getReports() {
    try {
        const savedReports = localStorage.getItem(REPORT_STORAGE_KEY);

        return savedReports ? JSON.parse(savedReports) : [];
    } catch (error) {
        console.error("Could not read community reports:", error);
        return [];
    }
}

// Save community reports
export function saveReports(reports) {
    try {
        localStorage.setItem(
            REPORT_STORAGE_KEY,
            JSON.stringify(reports)
        );

        return true;
    } catch (error) {
        console.error("Could not save community reports:", error);
        return false;
    }
}

// Add a new community report

export function addReport(report) {
    const reports = getReports();

    reports.unshift(report);

    const recentReports = reports.slice(0, 100);

    if (!saveReports(recentReports)) return null;

    addActivity({
        type: "community_report",
        serviceName: report.serviceName,
        message: `A new community report was submitted for ${report.serviceName}.`
    });

    return report;
}

