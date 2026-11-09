import { useCallback, useEffect, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    LogOut,
    MapPin,
    Plus,
    Search,
    Sparkles,
    Ticket,
    Trash2,
    UserRound
} from "lucide-react";
import {
    Link,
    NavLink,
    Route,
    Routes,
    useNavigate,
    useParams
} from "react-router-dom";
import { api } from "./api";

const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium"
        }).format(date);
}

function Alert({ children, success = false }) {
    if (!children) return null;
    return <p className={success ? "notice success" : "notice error"} role="status">{children}</p>;
}

function EventCard({ event }) {
    return (
        <article className="event-card">
            <Link className="event-image-link" to={`/events/${event.id}`}>
                <img
                    src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                    alt=""
                    loading="lazy"
                />
                <span className="category">{event.category}</span>
            </Link>
            <div className="event-info">
                <p className="event-date"><CalendarDays size={15} /> {formatDate(event.date)}</p>
                <h2><Link to={`/events/${event.id}`}>{event.title}</Link></h2>
                <p className="event-location"><MapPin size={15} /> {event.location}</p>
                <div className="event-card-bottom">
                    <strong>{money.format(Number(event.price) || 0)}</strong>
                    <Link className="text-link" to={`/events/${event.id}`}>
                        Details <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </article>
    );
}

function EventList() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadEvents = useCallback(async () => {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);

        try {
            setEvents(await api.getEvents(params.toString() ? `?${params}` : ""));
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }, [search, category]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const categories = [...new Set(events.map((event) => event.category).filter(Boolean))];

    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <p className="eyebrow"><Sparkles size={16} /> MAKE EVERY MOMENT COUNT</p>
                    <h1>Find your next<br /><span>great experience.</span></h1>
                    <p>Discover campus events, meet your people, and make memories that last.</p>
                    <a className="primary-btn" href="#events">Explore events <ArrowRight size={17} /></a>
                </div>
                <div className="hero-art" aria-hidden="true">
                    <div className="hero-orbit orbit-one" />
                    <div className="hero-orbit orbit-two" />
                    <div className="hero-ticket"><Ticket size={64} /></div>
                    <span className="hero-spark spark-one">✦</span>
                    <span className="hero-spark spark-two">✦</span>
                </div>
            </section>

            <main className="container" id="events">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">YOUR CAMPUS, YOUR CALENDAR</p>
                        <h2>Upcoming events</h2>
                    </div>
                    <p>Find something worth looking forward to.</p>
                </div>

                <form className="filters" onSubmit={(event) => { event.preventDefault(); loadEvents(); }}>
                    <label className="search-field">
                        <Search size={19} />
                        <input
                            aria-label="Search events"
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search events, places, or ideas..."
                            value={search}
                        />
                    </label>
                    <select
                        aria-label="Filter by category"
                        onChange={(event) => setCategory(event.target.value)}
                        value={category}
                    >
                        <option value="">All categories</option>
                        {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <button className="filter-btn" type="submit">Search</button>
                </form>

                <Alert>{error}</Alert>
                {loading ? (
                    <p className="empty-state">Finding events for you...</p>
                ) : events.length ? (
                    <div className="event-grid">
                        {events.map((event) => <EventCard event={event} key={event.id} />)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <CalendarDays size={30} />
                        <h3>No events to show yet</h3>
                        <p>{error ? "The event service is unavailable right now. Please try again later." : "Try another search, or check back soon for new events."}</p>
                    </div>
                )}
            </main>
        </>
    );
}

function EventDetails({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        api.getEvent(id)
            .then((item) => { if (active) setEvent(item); })
            .catch((requestError) => { if (active) setError(requestError.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    async function bookEvent() {
        if (!user) {
            navigate("/login");
            return;
        }

        setError("");
        setMessage("");
        try {
            const result = await api.book(event.id, Number(quantity));
            setMessage(result.message || "Your tickets are booked.");
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    if (loading) return <main className="container"><p className="empty-state">Loading event...</p></main>;
    if (!event) return <main className="container"><Alert>{error || "Event not found."}</Alert><Link className="text-link" to="/">Back to events</Link></main>;

    return (
        <main className="container detail-container">
            <Link className="back-link" to="/">← Back to events</Link>
            <article className="details">
                <img src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} alt="" />
                <span className="category">{event.category}</span>
                <h1>{event.title}</h1>
                <p className="detail-description">{event.description}</p>
                <div className="detail-meta">
                    <p><CalendarDays size={18} /> {formatDate(event.date)}{event.time ? ` · ${event.time}` : ""}</p>
                    <p><MapPin size={18} /> {event.location}</p>
                </div>
                <div className="booking-box">
                    <div><span>Ticket price</span><strong>{money.format(Number(event.price) || 0)}</strong></div>
                    <label htmlFor="ticket-quantity">Tickets</label>
                    <input
                        id="ticket-quantity"
                        min="1"
                        max="10"
                        onChange={(input) => setQuantity(input.target.value)}
                        type="number"
                        value={quantity}
                    />
                    <button className="primary-btn" onClick={bookEvent} type="button">
                        {user ? "Book tickets" : "Sign in to book"}
                    </button>
                </div>
                <Alert success>{message}</Alert>
                <Alert>{error}</Alert>
            </article>
        </main>
    );
}

function AuthPage({ mode, onLogin }) {
    const isRegister = mode === "register";
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = isRegister ? await api.register(form) : await api.login(form);
            onLogin(result);
            navigate("/");
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-container">
            <form className="auth-form" onSubmit={submit}>
                <p className="eyebrow">{isRegister ? "JOIN THE COMMUNITY" : "WELCOME BACK"}</p>
                <h1>{isRegister ? "Create your account" : "Sign in"}</h1>
                <p className="auth-intro">{isRegister ? "Save your spot at the events you love." : "Your next great experience is waiting."}</p>
                {isRegister && (
                    <label className="form-label">Full name
                        <input autoComplete="name" onChange={(e) => setForm({ ...form, name: e.target.value })} required value={form.name} />
                    </label>
                )}
                <label className="form-label">Email
                    <input autoComplete="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" value={form.email} />
                </label>
                <label className="form-label">Password
                    <input autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} onChange={(e) => setForm({ ...form, password: e.target.value })} required type="password" value={form.password} />
                </label>
                <Alert>{error}</Alert>
                <button className="primary-btn auth-submit" disabled={loading} type="submit">
                    {loading ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
                </button>
                <p>{isRegister ? "Already have an account?" : "New to EventSphere?"}{" "}
                    <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link>
                </p>
            </form>
        </main>
    );
}

function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    const loadBookings = useCallback(async () => {
        try {
            setBookings(await api.myBookings());
        } catch (requestError) {
            setError(requestError.message);
        }
    }, []);

    useEffect(() => { loadBookings(); }, [loadBookings]);

    async function cancelBooking(id) {
        setError("");
        try {
            await api.cancelBooking(id);
            await loadBookings();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    return (
        <main className="container">
            <div className="section-heading">
                <div><p className="eyebrow">YOUR PLANS</p><h1>My bookings</h1></div>
                <Link className="primary-btn" to="/">Discover events <ArrowRight size={16} /></Link>
            </div>
            <Alert>{error}</Alert>
            {bookings.length ? <div className="booking-list">
                {bookings.map((booking) => (
                    <article className="booking-row" key={booking.id}>
                        <div>
                            <span className={`booking-status ${booking.status === "cancelled" ? "cancelled" : ""}`}>{booking.status || "confirmed"}</span>
                            <h2>{booking.title}</h2>
                            <p><CalendarDays size={15} /> {formatDate(booking.date)} · {booking.time}</p>
                            <p><MapPin size={15} /> {booking.location}</p>
                            <p>{booking.quantity} ticket{booking.quantity === 1 ? "" : "s"} · {money.format(Number(booking.total_price) || 0)}</p>
                        </div>
                        {booking.status !== "cancelled" && <button className="secondary-btn" onClick={() => cancelBooking(booking.id)} type="button">Cancel booking</button>}
                    </article>
                ))}
            </div> : !error && <div className="empty-state"><Ticket size={30} /><h3>No bookings yet</h3><p>Your booked tickets will show up here.</p></div>}
        </main>
    );
}

const emptyEvent = {
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    time: "",
    price: "",
    image: ""
};

function AdminPage() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState(emptyEvent);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadEvents = useCallback(async () => {
        try {
            setEvents(await api.getEvents());
        } catch (requestError) {
            setError(requestError.message);
        }
    }, []);

    useEffect(() => { loadEvents(); }, [loadEvents]);

    async function addEvent(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        try {
            const payload = {
                ...form,
                date: form.date.replace("T", " "),
                price: Number(form.price)
            };
            await api.addEvent(payload);
            setForm(emptyEvent);
            setMessage("Event added successfully.");
            await loadEvents();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    async function deleteEvent(id) {
        setError("");
        setMessage("");
        try {
            await api.deleteEvent(id);
            setEvents((current) => current.filter((event) => event.id !== id));
            setMessage("Event deleted.");
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    const fields = [
        ["title", "Event title", "text"],
        ["category", "Category", "text"],
        ["location", "Location", "text"],
        ["date", "Date and time", "datetime-local"],
        ["time", "Display time", "text"],
        ["price", "Ticket price (₹)", "number"],
        ["image", "Image URL", "url"]
    ];

    return (
        <main className="container">
            <div className="section-heading"><div><p className="eyebrow">EVENTSPHERE MANAGEMENT</p><h1>Admin dashboard</h1></div></div>
            <form className="admin-form" onSubmit={addEvent}>
                <h2><Plus size={19} /> Add an event</h2>
                <div className="admin-fields">
                    {fields.map(([name, label, type]) => (
                        <label className="form-label" key={name}>{label}
                            <input
                                min={type === "number" ? "0" : undefined}
                                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                                required={name !== "image"}
                                step={type === "number" ? "1" : undefined}
                                type={type}
                                value={form[name]}
                            />
                        </label>
                    ))}
                </div>
                <label className="form-label">Description
                    <textarea onChange={(e) => setForm({ ...form, description: e.target.value })} required rows="4" value={form.description} />
                </label>
                <Alert success>{message}</Alert>
                <Alert>{error}</Alert>
                <button className="primary-btn" type="submit">Publish event</button>
            </form>
            <h2 className="admin-list-title">Manage events</h2>
            <div className="admin-list">
                {events.map((event) => (
                    <article className="admin-event" key={event.id}>
                        <div><strong>{event.title}</strong><p>{formatDate(event.date)} · {event.location}</p></div>
                        <button aria-label={`Delete ${event.title}`} className="delete-btn" onClick={() => deleteEvent(event.id)} type="button"><Trash2 size={17} /> Delete</button>
                    </article>
                ))}
            </div>
        </main>
    );
}

function App() {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    function login(result) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <div className="app-shell">
            <header className="header">
                <Link className="logo" to="/"><span className="logo-mark"><CalendarDays size={19} /></span> EventSphere</Link>
                <nav aria-label="Main navigation">
                    <NavLink end to="/">Discover</NavLink>
                    {user && <NavLink to="/bookings">My bookings</NavLink>}
                    {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
                </nav>
                <div className="header-account">
                    {user ? (
                        <>
                            <span className="user-greeting"><UserRound size={16} /> {user.name}</span>
                            <button className="header-action" onClick={logout} type="button"><LogOut size={16} /> Sign out</button>
                        </>
                    ) : (
                        <>
                            <Link className="sign-in-link" to="/login">Sign in</Link>
                            <Link className="header-cta" to="/register">Get started <ArrowRight size={15} /></Link>
                        </>
                    )}
                </div>
            </header>
            <Routes>
                <Route element={<EventList />} path="/" />
                <Route element={<EventDetails user={user} />} path="/events/:id" />
                <Route element={<AuthPage mode="login" onLogin={login} />} path="/login" />
                <Route element={<AuthPage mode="register" onLogin={login} />} path="/register" />
                <Route element={user ? <BookingsPage /> : <AuthPage mode="login" onLogin={login} />} path="/bookings" />
                <Route element={user?.role === "admin" ? <AdminPage /> : <EventList />} path="/admin" />
                <Route element={<EventList />} path="*" />
            </Routes>
            <footer className="footer">
                <Link className="logo footer-logo" to="/"><span className="logo-mark"><CalendarDays size={18} /></span> EventSphere</Link>
                <p>Good times start here. Discover, connect, and experience more.</p>
                <small>© {new Date().getFullYear()} EventSphere · Made for moments that matter.</small>
            </footer>
        </div>
    );
}

export default App;
