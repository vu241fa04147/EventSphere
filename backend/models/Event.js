
const pool = require("../config/db");

const Event = {
    async find(filter = {}) {
        let sql = "SELECT * FROM events";
        const conditions = [];
        const values = [];

        if (filter.category && filter.category !== "All") {
            conditions.push("category = ?");
            values.push(filter.category);
        }

        if (filter.search) {
            conditions.push(
                "(title LIKE ? OR location LIKE ? OR description LIKE ?)"
            );
            const search = `%${filter.search}%`;
            values.push(search, search, search);
        }

        if (conditions.length) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " ORDER BY date ASC";

        const [rows] = await pool.execute(sql, values);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.execute(
            "SELECT * FROM events WHERE id = ? LIMIT 1",
            [id]
        );

        return rows[0] || null;
    },

    async create(event) {
        const {
            title, description, category,
            location, date, time, price, image
        } = event;

        const [result] = await pool.execute(
            `INSERT INTO events
            (title, description, category, location, date, time, price, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, category, location, date, time, price, image]
        );

        return this.findById(result.insertId);
    },

    async findByIdAndDelete(id) {
        const event = await this.findById(id);

        if (!event) return null;

        await pool.execute("DELETE FROM events WHERE id = ?", [id]);
        return event;
    }
};

module.exports = Event;
