
const pool = require("../config/db");

const Booking = {
    async create(booking) {
        const {
            user_id,
            event_id,
            quantity,
            total_price
        } = booking;

        const [result] = await pool.execute(
            `INSERT INTO bookings
            (user_id, event_id, quantity, total_price)
            VALUES (?, ?, ?, ?)`,
            [user_id, event_id, quantity, total_price]
        );

        const [rows] = await pool.execute(
            "SELECT * FROM bookings WHERE id = ?",
            [result.insertId]
        );

        return rows[0];
    },

    async findByUserId(userId) {
        const [rows] = await pool.execute(
            `SELECT b.*, e.title, e.date, e.time, e.location, e.image
             FROM bookings b
             JOIN events e ON b.event_id = e.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [userId]
        );

        return rows;
    },

    async findById(id) {
        const [rows] = await pool.execute(
            "SELECT * FROM bookings WHERE id = ?",
            [id]
        );

        return rows[0] || null;
    },

    async cancel(id, userId) {
        const [result] = await pool.execute(
            `UPDATE bookings
             SET status = 'cancelled'
             WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        return result.affectedRows > 0;
    }
};

module.exports = Booking;
