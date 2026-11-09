
const router = require("express").Router();
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", async (req, res) => {
    try {
        const { search, category } = req.query;

        const events = await Event.find({
            search,
            category
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(400).json({ message: "Invalid event ID" });
    }
});

router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
