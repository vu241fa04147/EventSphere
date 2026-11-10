const API = (import.meta.env.VITE_API_URL || "https://eventsphere-backend-9vfg.onrender.com/api").replace(/\/+$/, "");

async function request(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API}${path}`, {
            ...options,
            headers: {
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...(localStorage.getItem("token")
                    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    : {}),
                ...(options.headers || {})
            }
        });
    } catch {
        throw new Error("Cannot reach the EventSphere backend. Please try again.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = typeof data.message === "string" ? data.message.trim() : "";
        throw new Error(message || (
            response.status >= 500
                ? "The EventSphere service is unavailable. The backend database may need configuration."
                : "Something went wrong. Please check your details and try again."
        ));
    }

    return data;
}

export const api = {
    getEvents: (query = "") => request(`/events${query}`),
    getEvent: (id) => request(`/events/${encodeURIComponent(id)}`),
    register: (body) => request("/auth/register", {
        method: "POST",
        body: JSON.stringify(body)
    }),
    login: (body) => request("/auth/login", {
        method: "POST",
        body: JSON.stringify(body)
    }),
    book: (eventId, quantity) => request("/bookings", {
        method: "POST",
        body: JSON.stringify({ eventId, quantity })
    }),
    myBookings: () => request("/bookings/my"),
    cancelBooking: (id) => request(`/bookings/${encodeURIComponent(id)}/cancel`, {
        method: "PATCH"
    }),
    addEvent: (body) => request("/events", {
        method: "POST",
        body: JSON.stringify(body)
    }),
    deleteEvent: (id) => request(`/events/${encodeURIComponent(id)}`, {
        method: "DELETE"
    })
};
