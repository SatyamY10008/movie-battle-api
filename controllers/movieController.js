const { getDB } = require("../db");

// ========================================
// GET ALL MOVIES
// ========================================

const getAllMovies = async (req, res) => {
    try {
        const db = getDB();

        const movies = await db
            .collection("movies")
            .find({})
            .toArray();

        res.json({
            success: true,
            count: movies.length,
            movies: movies
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: "❌ Failed to fetch movies from MongoDB."
        });
    }
};


// ========================================
// GET SINGLE MOVIE
// ========================================

const getMovieById = async (req, res) => {
    try {
        const db = getDB();

        const movieId = Number(req.params.id);

        if (Number.isNaN(movieId)) {
            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }

        const movie = await db
            .collection("movies")
            .findOne({ id: movieId });

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }

        res.json({
            success: true,
            movie: movie
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: "❌ Failed to fetch movie from MongoDB."
        });
    }
};


// ========================================
// CREATE NEW MOVIE
// ========================================

const createMovie = async (req, res) => {
    try {
        const db = getDB();

        const { title, genre, rating } = req.body;

        if (!title || !genre || rating === undefined) {
            return res.status(400).json({
                success: false,
                error: "MISSING_FIELDS",
                message: "❌ title, genre and rating are required."
            });
        }

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

        const lastMovie = await db
            .collection("movies")
            .find({})
            .sort({ id: -1 })
            .limit(1)
            .toArray();

        const newId = lastMovie.length > 0
            ? lastMovie[0].id + 1
            : 1;

        const newMovie = {
            id: newId,
            title: title,
            genre: genre,
            rating: rating
        };

        await db.collection("movies").insertOne(newMovie);

        res.status(201).json({
            success: true,
            message: "🎬 Movie added successfully!",
            movie: newMovie
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: "❌ Failed to create movie."
        });
    }
};


// ========================================
// UPDATE COMPLETE MOVIE
// ========================================

const updateMovie = async (req, res) => {
    try {
        const db = getDB();

        const movieId = Number(req.params.id);

        if (Number.isNaN(movieId)) {
            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }

        const { title, genre, rating } = req.body;

        if (!title || !genre || rating === undefined) {
            return res.status(400).json({
                success: false,
                error: "MISSING_FIELDS",
                message: "❌ title, genre and rating are required."
            });
        }

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

        const result = await db.collection("movies").updateOne(
            { id: movieId },
            {
                $set: {
                    title: title,
                    genre: genre,
                    rating: rating
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }

        const updatedMovie = await db
            .collection("movies")
            .findOne({ id: movieId });

        res.json({
            success: true,
            message: "🎬 Movie updated successfully!",
            movie: updatedMovie
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: "❌ Failed to update movie."
        });
    }
};


// ========================================
// PATCH PARTIAL MOVIE
// ========================================

const patchMovie = async (req, res) => {
    try {
        const db = getDB();

        const movieId = Number(req.params.id);

        if (Number.isNaN(movieId)) {
            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }

        const { title, genre, rating } = req.body;

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

        const updates = {};

        if (title !== undefined) {
            updates.title = title;
        }

        if (genre !== undefined) {
            updates.genre = genre;
        }

        if (rating !== undefined) {
            updates.rating = rating;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: "NO_FIELDS",
                message: "❌ Provide at least one field to update."
            });
        }

        const result = await db.collection("movies").updateOne(
            { id: movieId },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }

        const updatedMovie = await db
            .collection("movies")
            .findOne({ id: movieId });

        res.json({
            success: true,
            message: "🎬 Movie partially updated successfully!",
            movie: updatedMovie
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: "❌ Failed to partially update movie."
        });
    }
};


// ========================================
// DELETE MOVIE
// ========================================

const deleteMovie = async (req, res) => {
    try {
        const db = getDB();

        const movieId = Number(req.params.id);

        if (Number.isNaN(movieId)) {
            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }

        const movie = await db
            .collection("movies")
            .findOne({ id: movieId });

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }

        await db.collection("movies").deleteOne({ id: movieId });

        res.json({
            success: true,
            message: "🗑️ Movie deleted successfully!",
            movie: movie
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: "❌ Failed to delete movie."
        });
    }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    patchMovie,
    deleteMovie
};