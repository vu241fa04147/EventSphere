const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, default: "" },
  availableSeats: { type: Number, required: true, min: 0, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
