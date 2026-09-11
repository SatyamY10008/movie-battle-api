const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
    findUserByUsername,
    createUser
} = require("../models/userModel");


// ========================================
// REGISTER USER
// ========================================

const registerUser = async (req, res, next) => {

    try {

        const { username, password } = req.body;

        // Check required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: "MISSING_FIELDS",
                message: "❌ Username and password are required."
            });
        }

        // Check if username already exists
        const existingUser = await findUserByUsername(username);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "USERNAME_EXISTS",
                message: "❌ Username already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await createUser({
            username: username,
            password: hashedPassword,
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "✅ User registered successfully!"
        });

    } catch (error) {

        next(error);

    }
};


// ========================================
// LOGIN USER
// ========================================

const loginUser = async (req, res, next) => {

    try {

        const { username, password } = req.body;

        // Check required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: "MISSING_CREDENTIALS",
                message: "❌ Username and password are required."
            });
        }

        // Find user in MongoDB
        const user = await findUserByUsername(username);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "INVALID_CREDENTIALS",
                message: "❌ Invalid username or password."
            });
        }

        // Compare password with bcrypt hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                error: "INVALID_CREDENTIALS",
                message: "❌ Invalid username or password."
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Send response
        res.json({
            success: true,
            message: "✅ Login successful!",
            token: token
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    registerUser,
    loginUser
};