const express = require("express");

const router = express.Router();

// Controllers
const {
    registerUser,
    loginUser
} = require("../controllers/userController");


// ========================================
// USER ROUTES
// ========================================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);


module.exports = router;