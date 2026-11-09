require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Event = require("./models/Event");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const adminEmail = "admin@eventsphere.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "EventSphere Admin",
        email: adminEmail,
        password: await bcrypt.hash("Admin@123", 10),
        role: "admin"
      });
    } else {
      admin.role = "admin";
      await admin.save();
    }

    if (await Event.countDocuments() === 0) {
      const events = [
        {
          title: "Campus Music Night",
          description: "An energetic evening featuring live music, student bands and great performances.",
          category: "Music",
          location: "Vignan University, Vadlamudi",
          date: new Date("2027-02-15T17:00:00"),
          time: "5:00 PM",
          price: 199,
          availableSeats: 150,
          image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900"
        },
        {
          title: "Technology & Innovation Summit",
          description: "Explore practical technology ideas, student projects and inspiring tech talks.",
          category: "Technology",
          location: "Guntur",
          date: new Date("2027-03-10T10:00:00"),
          time: "10:00 AM",
          price: 299,
          availableSeats: 100,
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900"
        },
        {
          title: "Creative Arts Festival",
          description: "A celebration of art, dance, photography and creative expression.",
          category: "Arts",
          location: "Vijayawada",
          date: new Date("2027-03-25T16:00:00"),
          time: "4:00 PM",
          price: 149,
          availableSeats: 200,
          image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900"
        },
        {
          title: "Career & Business Workshop",
          description: "Learn about career planning, communication, entrepreneurship and interviews.",
          category: "Workshop",
          location: "Guntur",
          date: new Date("2027-04-05T11:00:00"),
          time: "11:00 AM",
          price: 99,
          availableSeats: 80,
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900"
        }
      ];
      await Event.insertMany(events);
    }

    console.log("Demo data ready.");
    console.log("Admin email: admin@eventsphere.com");
    console.log("Admin password: Admin@123");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
seed();
