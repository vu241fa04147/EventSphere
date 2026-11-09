const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
        index: true
    },
    quantity: { type: Number, required: true, min: 1 },
    total_price: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }
}, { timestamps: true });

bookingSchema.statics.findByUserId = async function (userId) {
    const bookings = await this.find({ user_id: userId })
        .populate("event_id", "title date time location image")
        .sort({ createdAt: -1 });

    return bookings.map((booking) => {
        const result = booking.toObject({ virtuals: true });
        const event = result.event_id;

        return {
            ...result,
            event_id: event?._id?.toString() || null,
            title: event?.title,
            date: event?.date,
            time: event?.time,
            location: event?.location,
            image: event?.image
        };
    });
};

bookingSchema.statics.cancelForUser = async function (bookingId, userId) {
    const result = await this.updateOne(
        { _id: bookingId, user_id: userId, status: { $ne: "cancelled" } },
        { $set: { status: "cancelled" } }
    );
    return result.modifiedCount > 0;
};

bookingSchema.statics.deleteForEvent = function (eventId) {
    return this.deleteMany({ event_id: eventId });
};

module.exports = mongoose.model("Booking", bookingSchema);
