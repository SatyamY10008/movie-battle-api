const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());
app.use(helmet());


// ========================================
// RATE LIMITER
// ========================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "TOO_MANY_REQUESTS",
        message: "❌ Too many requests. Please try again later."
    }
});

app.use(apiLimiter);


// ========================================
// IMPORTS
// ========================================

// Movie routes
const movieRoutes = require("./routes/movieRoutes");

// User routes
const userRoutes = require("./routes/userRoutes");

// Swagger
const {
    swaggerUi,
    swaggerDocument
} = require("./swagger");

// MongoDB connection
const { connectDB } = require("./db");

// 404 middleware
const notFound = require("./middleware/notFound");

// Error handler
const errorHandler = require("./middleware/errorHandler");


// ========================================
// API ROUTES
// ========================================

// Movie routes
app.use(movieRoutes);

// User routes
app.use(userRoutes);


// ========================================
// SWAGGER DOCUMENTATION
// ========================================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


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

        console.log(
            `📚 Swagger Docs available at http://localhost:${PORT}/api-docs`
        );

    });
}

startServer();