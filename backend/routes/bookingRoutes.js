
const router = require("express").Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

router.post("/", protect, async (req, res) => {
    try {
        const { eventId, quantity } = req.body;

        if (!eventId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "Valid event ID and quantity are required"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const booking = await Booking.create({
            user_id: req.user.id,
            event_id: event.id,
            quantity: Number(quantity),
            total_price: Number(event.price) * Number(quantity)
        });

        res.status(201).json({
            message: "Booking successful",
            booking
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/my", protect, async (req, res) => {
    try {
        const bookings = await Booking.findByUserId(req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id/cancel", protect, async (req, res) => {
    try {
        const cancelled = await Booking.cancel(
            req.params.id,
            req.user.id
        );

        if (!cancelled) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.json({ message: "Booking cancelled successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
