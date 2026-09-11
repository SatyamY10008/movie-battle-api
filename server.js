const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "TOO_MANY_REQUESTS",
        message: "❌ Too many requests. Please try again later."
    }
});
// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());
app.use(helmet());
app.use(apiLimiter);

// ========================================
// IMPORTS
// ========================================

// Movie routes
const movieRoutes = require("./routes/movieRoutes");

// MongoDB connection
const { connectDB } = require("./db");

// 404 middleware
const notFound = require("./middleware/notFound");

// Error handler
const errorHandler = require("./middleware/errorHandler");


// ========================================
// MOVIE ROUTES
// ========================================

app.use(movieRoutes);


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🎬 Welcome to Movie Battle API!"
    });
});


// ========================================
// 404 HANDLER
// ========================================

app.use(notFound);


// ========================================
// ERROR HANDLER
// ========================================

app.use(errorHandler);


// ========================================
// START SERVER
// ========================================

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `🚀 Movie Battle API running on http://localhost:${PORT}`
        );
    });
}

startServer();