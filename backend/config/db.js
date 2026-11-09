const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function connectDatabase() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is required to connect to MongoDB Atlas.");
    }

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
    });

    console.log(`MongoDB connected to database "${mongoose.connection.name}".`);
    return mongoose.connection;
}

module.exports = { connectDatabase, mongoose };
