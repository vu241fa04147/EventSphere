import { api } from "./api";
const API = "https://eventsphere-0rp0.onrender.com/api";

async function request(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",

                ...(localStorage.getItem("token")
                    ? {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                    : {}),

                ...(options.headers || {})
            }
        });
    } catch (error) {
        throw new Error("Cannot reach the EventSphere backend. Please try again.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}

export const api = {
    // Get all events
    getEvents: (query = "") =>
        request(`/events${query}`),

    // Register user
    register: (body) =>
        request("/auth/register", {
            method: "POST",
            body: JSON.stringify(body)
        }),

    // Login user
    login: (body) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify(body)
        }),

    // Book event tickets
    book: (eventId, quantity) =>
        request("/bookings", {
            method: "POST",
            body: JSON.stringify({ eventId, quantity })
        }),

    // Get logged-in user's bookings
    myBookings: () =>
        request("/bookings/my"),

    // Cancel booking
    cancelBooking: (id) =>
        request(`/bookings/${id}/cancel`, {
            method: "PATCH"
        }),

    // Add event (Admin)
    addEvent: (body) =>
        request("/events", {
            method: "POST",
            body: JSON.stringify(body)
        }),

    // Delete event (Admin)
    deleteEvent: (id) =>
        request(`/events/${id}`, {
            method: "DELETE"
        })
};
