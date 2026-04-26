// authRoutes.js - Authentication route definitions
// This file maps URL paths to their controller functions.
// We use Express Router to keep route definitions organized in separate files.

const express = require("express");
const router = express.Router();
const { signup, login, getProfile } = require("../../controllers/shared/authController");
const authMiddleware = require("../../middleware/authMiddleware");

// POST /api/auth/signup - Register a new user
// No authentication needed (anyone can create an account)
router.post("/signup", signup);

// POST /api/auth/login - Log in an existing user
// No authentication needed (user does not have a token yet)
router.post("/login", login);

// GET /api/auth/profile - Get the logged-in user's profile
// Requires authentication (authMiddleware checks the JWT token first)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
