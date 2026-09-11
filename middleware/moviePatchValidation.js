const validateMoviePatch = (req, res, next) => {

    const { title, genre, rating } = req.body;

    // ========================================
    // AT LEAST ONE FIELD REQUIRED
    // ========================================

    if (
        title === undefined &&
        genre === undefined &&
        rating === undefined
    ) {
        return res.status(400).json({
            success: false,
            error: "NO_FIELDS",
            message: "❌ Provide at least one field to update."
        });
    }


    // ========================================
    // TITLE VALIDATION
    // ========================================

    if (title !== undefined) {

        if (
            typeof title !== "string" ||
            title.trim().length === 0
        ) {
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
    }


    // ========================================
    // GENRE VALIDATION
    // ========================================

    if (genre !== undefined) {

        if (
            typeof genre !== "string" ||
            genre.trim().length === 0
        ) {
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
    }


    // ========================================
    // RATING VALIDATION
    // ========================================

    if (rating !== undefined) {

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
    }


    // ========================================
    // EVERYTHING VALID
    // ========================================

    next();
};


module.exports = validateMoviePatch;