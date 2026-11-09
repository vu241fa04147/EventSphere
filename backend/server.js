
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("EventSphere API is running with TiDB!");
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            server: "Running",
            database: "Connected to TiDB"
        });
    } catch (error) {
        res.status(500).json({
            server: "Running",
            database: "Not Connected",
            error: error.message
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`EventSphere server running on port ${PORT}`);
});
