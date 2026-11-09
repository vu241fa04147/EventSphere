import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, MapPin, Ticket, Search, Music2, Sparkles, ShieldCheck, LogOut, Menu, X } from "lucide-react";
import { api } from "./api";

const money = (value) => Number(value) === 0 ? "Free" : `₹${Number(value).toLocaleString("en-IN")}`;
const dateText = (value) => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return <header className="navbar">
    <Link to="/" className="brand"><span className="brand-mark"><Ticket size={20}/></span>Event<span>Sphere</span></Link>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? "nav-links show" : "nav-links"}>
      <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/events" onClick={() => setOpen(false)}>Explore Events</NavLink>
      {user && <NavLink to="/bookings" onClick={() => setOpen(false)}>My Bookings</NavLink>}
      {user?.role === "admin" && <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>}
      {user ? <button className="nav-user" onClick={onLogout}><span>{user.name.split(" ")[0]}</span><LogOut size={16}/> Logout</button>
        : <><NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink><Link className="nav-cta" to="/register" onClick={() => setOpen(false)}>Get Started</Link></>}
    </nav>
  </header>;
}

function EventCard({ event, onBook }) {
  return <article className="event-card">
    <div className="event-image" style={{ backgroundImage: `url("${event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900"}")` }}>
      <span className="category-tag">{event.category}</span>
      <span className="price-tag">{money(event.price)}</span>
    </div>
    <div className="event-content">
      <div className="event-date"><CalendarDays size={15}/>{dateText(event.date)} · {event.time}</div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <div className="event-bottom"><span><MapPin size={15}/>{event.location}</span><button onClick={() => onBook(event)} className="text-button">Book now <span>↗</span></button></div>
    </div>
  </article>;
}

function Home({ events, onBook }) {
  return <>
    <section className="hero">
      <div className="hero-glow"></div>
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> YOUR NEXT GREAT MEMORY STARTS HERE</div>
        <h1>Find your people.<br/><span>Feel the moment.</span></h1>
        <p>Discover concerts, workshops, festivals and experiences happening around you. Your next favourite event is just a click away.</p>
        <div className="hero-actions"><Link to="/events" className="primary-btn">Explore events <span>↗</span></Link><Link to="/register" className="secondary-btn">Join EventSphere</Link></div>
        <div className="hero-stats"><div><strong>4+</strong><small>Curated events</small></div><i></i><div><strong>Easy</strong><small>Online booking</small></div><i></i><div><strong>Anytime</strong><small>Memories begin</small></div></div>
      </div>
      <div className="hero-art">
        <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
        <div className="art-card art-card-back"><Music2 size={30}/><span>LIVE MUSIC</span></div>
        <div className="art-card art-card-front"><div className="art-icon"><CalendarDays size={30}/></div><strong>Make it<br/>a moment.</strong><small>Discover something new</small><div className="art-dots">✦ ✦ ✦</div></div>
        <div className="floating-note note-one">✦ Discover</div><div className="floating-note note-two">Your plans, upgraded ↗</div>
      </div>
    </section>
    <section className="trust-strip"><span><ShieldCheck size={18}/> Simple booking</span><span><Ticket size={18}/> Your tickets in one place</span><span><Sparkles size={18}/> Experiences worth sharing</span></section>
    <section className="section">
      <div className="section-heading"><div><div className="eyebrow dark">HANDPICKED FOR YOU</div><h2>Upcoming events</h2><p>Explore what's happening next.</p></div><Link to="/events" className="view-all">View all events ↗</Link></div>
      {events.length ? <div className="event-grid">{events.slice(0, 3).map(event => <EventCard key={event._id} event={event} onBook={onBook}/>)}</div> : <div className="empty-state">No events yet. Run the seed command to add demo events.</div>}
    </section>
    <section className="cta-band"><div><div className="eyebrow">BE PART OF THE EXPERIENCE</div><h2>Good things happen<br/>when you show up.</h2></div><Link to="/register" className="primary-btn light-btn">Create your account ↗</Link></section>
  </>;
}

function Events({ events, onBook }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Music", "Technology", "Arts", "Workshop"];
  const filtered = events.filter(e => `${e.title} ${e.location} ${e.description}`.toLowerCase().includes(search.toLowerCase()) && (category === "All" || e.category === category));
  return <main className="page-shell">
    <div className="page-heading"><div className="eyebrow dark">DISCOVER YOUR NEXT EXPERIENCE</div><h1>Explore events</h1><p>Find something exciting to look forward to.</p></div>
    <div className="filters"><div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events or locations..."/></div><div className="category-filters">{categories.map(c => <button key={c} className={category === c ? "filter active" : "filter"} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
    <div className="results-line">{filtered.length} {filtered.length === 1 ? "event" : "events"} found</div>
    {filtered.length ? <div className="event-grid">{filtered.map(event => <EventCard key={event._id} event={event} onBook={onBook}/>)}</div> : <div className="empty-state">No matching events. Try another search.</div>}
  </main>;
}

function AuthPage({ mode, onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const isRegister = mode === "register";
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await onAuth(mode, form); navigate("/"); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><div className="auth-decoration"><div className="auth-circle"></div><div className="eyebrow">WELCOME TO EVENTSPHERE</div><h1>{isRegister ? "Every great memory starts with a hello." : "Welcome back to the experience."}</h1><p>{isRegister ? "Create your account and start discovering events worth remembering." : "Log in to manage your bookings and find your next experience."}</p><div className="auth-mini">✦ Discover · Connect · Experience</div></div>
    <div className="auth-card"><div className="auth-card-top"><span className="brand-mark"><Ticket size={20}/></span><div><h2>{isRegister ? "Create account" : "Sign in"}</h2><p>{isRegister ? "Join the EventSphere community" : "Enter your details to continue"}</p></div></div>
      <form onSubmit={submit}>{isRegister && <label>Full name<input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Your name" required/></label>}<label>Email address<input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@example.com" required/></label><label>Password<input type="password" minLength="8" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="At least 8 characters" required/></label>{error && <div className="error-message">{error}</div>}<button className="primary-btn full-btn" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account →" : "Sign in →"}</button></form>
      <p className="auth-switch">{isRegister ? "Already have an account?" : "New to EventSphere?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</Link></p>
    </div></main>;
}

function Bookings({ user, notify }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  async function load() { try { setBookings(await api.myBookings()); } catch (e) { setError(e.message); } }
  useEffect(() => { load(); }, []);
  async function cancel(id) { try { const data = await api.cancelBooking(id); notify(data.message); load(); } catch (e) { setError(e.message); } }
  return <main className="page-shell"><div className="page-heading"><div className="eyebrow dark">YOUR EVENT PASSES</div><h1>My bookings</h1><p>Hi {user.name}, here's where your plans come together.</p></div>{error && <div className="error-message">{error}</div>}{bookings.length ? <div className="booking-list">{bookings.map(b => <div className="booking-row" key={b._id}><div className="booking-symbol"><Ticket/></div><div className="booking-info"><h3>{b.event?.title || "Event"}</h3><p>{b.event ? `${dateText(b.event.date)} · ${b.event.location}` : "Event details unavailable"}</p><small>{b.quantity} ticket(s) · {money(b.totalAmount)}</small></div><div className="booking-status"><span className={b.status === "confirmed" ? "status confirmed" : "status cancelled"}>{b.status}</span>{b.status === "confirmed" && <button className="cancel-btn" onClick={() => cancel(b._id)}>Cancel booking</button>}</div></div>)}</div> : <div className="empty-state">No bookings yet. <Link to="/events">Explore events</Link> to get started.</div>}</main>;
}

function EventDetails({ user, notify }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  useEffect(() => { api.getEvents().then(list => setEvent(list.find(e => e._id === id) || null)).catch(e => setError(e.message)); }, [id]);
  async function book() {
    if (!user) return navigate("/login");
    try { const result = await api.book(id, quantity); notify(result.message); navigate("/bookings"); }
    catch (e) { setError(e.message); }
  }
  if (!event) return <main className="page-shell"><div className="empty-state">{error || "Loading event..."}</div></main>;
  return <main className="page-shell detail-layout"><img className="detail-image" src={event.image} alt={event.title}/><div className="detail-copy"><span className="category-tag inline-tag">{event.category}</span><h1>{event.title}</h1><p>{event.description}</p><div className="detail-facts"><span><CalendarDays/>{dateText(event.date)} · {event.time}</span><span><MapPin/>{event.location}</span><span><Ticket/>{event.availableSeats} seats available</span></div><h2>{money(event.price)} <small>/ ticket</small></h2><label className="quantity-label">Tickets <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}</select></label>{error && <div className="error-message">{error}</div>}<button className="primary-btn" onClick={book}>Book tickets · {money(event.price * quantity)} ↗</button></div></main>;
}

function Admin({ notify }) {
  const blank = { title:"", description:"", category:"Music", location:"", date:"", time:"", price:0, availableSeats:100, image:"" };
  const [form, setForm] = useState(blank);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  async function load() { try { setEvents(await api.getEvents()); } catch (e) { setMessage(e.message); } }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault(); setMessage("");
    try { await api.addEvent({...form, price:Number(form.price), availableSeats:Number(form.availableSeats)}); setForm(blank); notify("Event added successfully"); load(); }
    catch (e) { setMessage(e.message); }
  }
  async function remove(id) { try { await api.deleteEvent(id); notify("Event deleted"); load(); } catch (e) { setMessage(e.message); } }
  return <main className="page-shell"><div className="page-heading"><div className="eyebrow dark">EVENT CONTROL CENTRE</div><h1>Admin dashboard</h1><p>Create and manage the events listed on EventSphere.</p></div><div className="admin-layout"><form className="admin-form" onSubmit={submit}><h2>Add a new event</h2>{[["title","Event title"],["description","Description"],["location","Location"],["date","Date"],["time","Time"],["price","Ticket price (₹)"],["availableSeats","Available seats"],["image","Image URL (optional)"]].map(([key,label])=><label key={key}>{label}<input required={key !== "image"} type={key === "date" ? "date" : ["price","availableSeats"].includes(key) ? "number" : "text"} min={["price","availableSeats"].includes(key) ? "0" : undefined} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}/></label>)}<label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{["Music","Technology","Arts","Workshop","Sports","Other"].map(x=><option key={x}>{x}</option>)}</select></label>{message && <div className="error-message">{message}</div>}<button className="primary-btn full-btn">Publish event</button></form><div className="admin-events"><h2>Current events ({events.length})</h2>{events.map(e=><div className="admin-event" key={e._id}><div><strong>{e.title}</strong><small>{e.category} · {dateText(e.date)}</small></div><button onClick={()=>remove(e._id)}>Delete</button></div>)}</div></div></main>;
}

function Footer() { return <footer className="footer"><Link to="/" className="brand"><span className="brand-mark"><Ticket size={18}/></span>Event<span>Sphere</span></Link><p>Make room for moments that matter.</p><small>© 2026 EventSphere. Built for experiences.</small></footer>; }

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } });
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState("");
  async function loadEvents() { try { setEvents(await api.getEvents()); } catch (e) { console.error(e.message); } }
  useEffect(() => { loadEvents(); }, []);
  function notify(message) { setToast(message); window.setTimeout(() => setToast(""), 3200); }
  async function authenticate(mode, form) {
    const data = mode === "register" ? await api.register(form) : await api.login(form);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    notify(data.message);
  }
  function logout() { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); notify("Logged out successfully"); }
  function bookEvent(event) { window.location.href = `/events/${event._id}`; }
  return <><Navbar user={user} onLogout={logout}/><Routes>
    <Route path="/" element={<Home events={events} onBook={bookEvent}/>}/>
    <Route path="/events" element={<Events events={events} onBook={bookEvent}/>}/>
    <Route path="/events/:id" element={<EventDetails user={user} notify={notify}/>}/>
    <Route path="/register" element={<AuthPage mode="register" onAuth={authenticate}/>}/>
    <Route path="/login" element={<AuthPage mode="login" onAuth={authenticate}/>}/>
    <Route path="/bookings" element={user ? <Bookings user={user} notify={notify}/> : <AuthPage mode="login" onAuth={authenticate}/>}/>
    <Route path="/admin" element={user?.role === "admin" ? <Admin notify={notify}/> : <main className="page-shell"><div className="empty-state">Admin access required. Sign in with the demo admin account.</div></main>}/>
    <Route path="*" element={<main className="page-shell"><div className="empty-state"><h2>Page not found</h2><Link to="/">Return home</Link></div></main>}/>
  </Routes><Footer/>{toast && <div className="toast">{toast}</div>}</>;
}
