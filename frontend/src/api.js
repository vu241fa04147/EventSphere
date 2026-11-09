const API = "https://eventsphere-0rp0.onrender.com/api";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {}),
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error("Cannot reach the EventSphere backend.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  getEvents: (query = "") => request(`/events${query}`),
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
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, {
    method: "PATCH"
  }),
  addEvent: (body) => request("/events", {
    method: "POST",
    body: JSON.stringify(body)
  }),
  deleteEvent: (id) => request(`/events/${id}`, {
    method: "DELETE"
  })
};