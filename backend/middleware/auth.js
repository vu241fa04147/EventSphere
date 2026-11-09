
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized. Please login."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found. Please login again."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

function adminOnly(req, res, next) {
    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({
        message: "Admin access required"
    });
}

module.exports = { protect, adminOnly };
