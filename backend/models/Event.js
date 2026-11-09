const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, required: true, trim: true, maxlength: 255 },
    date: { type: Date, required: true },
    time: { type: String, required: true, maxlength: 40 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" }
}, { timestamps: true });

eventSchema.statics.findMatching = function (filter = {}) {
    const query = {};

    if (filter.category && filter.category !== "All") {
        query.category = filter.category;
    }

    if (filter.search) {
        const escapedSearch = filter.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const search = new RegExp(escapedSearch, "i");
        query.$or = [
            { title: search },
            { location: search },
            { description: search }
        ];
    }

    return this.find(query).sort({ date: 1 });
};

module.exports = mongoose.model("Event", eventSchema);
