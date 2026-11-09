const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const pool = mysql.createPool({
    host: process.env.TIDB_HOST,
    port: Number(process.env.TIDB_PORT),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: {
        minVersion: "TLSv1.2"
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("TiDB Connected Successfully!");
        connection.release();
    } catch (error) {
        console.error("TiDB Connection Failed:", error.message);
    }
}

testConnection();

module.exports = pool;