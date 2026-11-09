
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

function makeToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findByEmail(normalizedEmail);

    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10)
    });

    let emailSent = false;

    try {
      emailSent = await sendEmail(
        normalizedEmail,
        "Registration Successful - EventSphere",
        `Hello ${name},

Welcome to EventSphere!

Your registration was successful.

You can now explore upcoming events and book your tickets.

Thank you for joining EventSphere!

Regards,
EventSphere Team`
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }

    return res.status(201).json({
      message: "Registration successful",
      emailSent,
      token: makeToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    return res.status(500).json({
      message: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findByEmail(
      email.trim().toLowerCase()
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    return res.json({
      message: "Login successful",
      token: makeToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = { register, login };
