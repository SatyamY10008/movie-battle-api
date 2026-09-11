const validateMovie = (req, res, next) => {

    let { title, genre, rating } = req.body;


    // ========================================
    // REQUIRED FIELDS
    // ========================================

    if (!title || !genre || rating === undefined) {
        return res.status(400).json({
            success: false,
            error: "MISSING_FIELDS",
            message: "❌ title, genre and rating are required."
        });
    }


    // ========================================
    // TITLE VALIDATION
    // ========================================

    if (typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: "INVALID_TITLE",
            message: "❌ Title must be a non-empty string."
        });
    }

    if (title.trim().length > 100) {
        return res.status(400).json({
            success: false,
            error: "TITLE_TOO_LONG",
            message: "❌ Title cannot be longer than 100 characters."
        });
    }


    // ========================================
    // GENRE VALIDATION
    // ========================================

    if (typeof genre !== "string" || genre.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: "INVALID_GENRE",
            message: "❌ Genre must be a non-empty string."
        });
    }

    if (genre.trim().length > 50) {
        return res.status(400).json({
            success: false,
            error: "GENRE_TOO_LONG",
            message: "❌ Genre cannot be longer than 50 characters."
        });
    }


    // ========================================
    // RATING VALIDATION
    // ========================================

    if (
        typeof rating !== "number" ||
        rating < 0 ||
        rating > 10
    ) {
        return res.status(400).json({
            success: false,
            error: "INVALID_RATING",
            message: "⭐ Rating must be a number between 0 and 10."
        });
    }


    // ========================================
    // CLEAN INPUT
    // ========================================

    title = title.trim();
    genre = genre.trim();

    req.body.title = title;
    req.body.genre = genre;


    // ========================================
    // EVERYTHING VALID
    // ========================================

    next();
};


module.exports = validateMovie;