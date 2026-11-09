
const express = require("express");
const cors = require("cors");
const { connectDatabase, mongoose } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("EventSphere API is running with MongoDB Atlas!");
});

app.get("/api/health", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                server: "Running",
                database: "Not Connected"
            });
        }

        await mongoose.connection.db.admin().ping();

        res.json({
            server: "Running",
            database: "Connected to MongoDB Atlas"
        });
    } catch {
        res.status(503).json({
            server: "Running",
            database: "Not Connected"
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

async function start() {
    await connectDatabase();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`EventSphere server running on port ${PORT}`);
    });
}

start().catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
});
