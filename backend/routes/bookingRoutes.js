const router = require("express").Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

router.post("/", protect, async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({ message: "Choose between 1 and 10 tickets" });
    }

    const event = await Event.findById(req.body.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (new Date(event.date) < new Date()) return res.status(400).json({ message: "This event has already passed" });
    if (event.availableSeats < quantity) return res.status(400).json({ message: "Not enough seats available" });

    event.availableSeats -= quantity;
    await event.save();

    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      quantity,
      totalAmount: event.price * quantity
    });

    res.status(201).json({ message: "Tickets booked successfully", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled") return res.status(400).json({ message: "Booking is already cancelled" });

    booking.status = "cancelled";
    await booking.save();

    if (booking.event) {
      booking.event.availableSeats += booking.quantity;
      await booking.event.save();
    }
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
