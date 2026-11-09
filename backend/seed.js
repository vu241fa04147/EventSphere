
const pool = require("./config/db");

const events = [
    {
        title: "Campus Music Night",
        description: "An energetic evening featuring live music, student bands and great performances.",
        category: "Music",
        location: "Vignan University, Vadlamudi",
        date: "2027-02-15 11:30:00",
        time: "5:00 PM",
        price: 199,
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
    },
    {
        title: "Technology & Innovation Summit",
        description: "Explore new technologies, innovation and ideas from industry experts.",
        category: "Technology",
        location: "Vignan University, Vadlamudi",
        date: "2027-03-10 10:00:00",
        time: "10:00 AM",
        price: 299,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
    },
    {
        title: "Creative Arts Festival",
        description: "Celebrate creativity through art, painting, music and cultural performances.",
        category: "Arts",
        location: "Vignan University, Vadlamudi",
        date: "2027-03-20 09:00:00",
        time: "9:00 AM",
        price: 149,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f"
    },
    {
        title: "Career & Business Workshop",
        description: "Learn career skills, entrepreneurship and professional development.",
        category: "Workshop",
        location: "Vignan University, Vadlamudi",
        date: "2027-04-05 09:30:00",
        time: "9:30 AM",
        price: 99,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
    }
];

async function seedEvents() {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS total FROM events");

        if (rows[0].total > 0) {
            console.log("Events already exist. No new events inserted.");
            return;
        }

        for (const event of events) {
            await pool.execute(
                `INSERT INTO events
                (title, description, category, location, date, time, price, image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    event.title,
                    event.description,
                    event.category,
                    event.location,
                    event.date,
                    event.time,
                    event.price,
                    event.image
                ]
            );
        }

        console.log("Four events inserted successfully!");
    } catch (error) {
        console.error("Seeding failed:", error.message);
    } finally {
        await pool.end();
    }
}

seedEvents();
