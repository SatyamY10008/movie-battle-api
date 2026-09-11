const express = require("express");

const router = express.Router();

// Controllers
const {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    patchMovie,
    deleteMovie
} = require("../controllers/movieController");

// Validation middleware
const validateMovie = require("../middleware/movieValidation");
const validateMoviePatch = require("../middleware/moviePatchValidation");

// Authentication middleware
const authenticateToken = require("../middleware/auth");


// ========================================
// PUBLIC MOVIE ROUTES
// ========================================

router.get("/movies", getAllMovies);

router.get("/movies/:id", getMovieById);


// ========================================
// PROTECTED MOVIE ROUTES
// ========================================

// JWT required
router.post(
    "/movies",
    authenticateToken,
    validateMovie,
    createMovie
);

router.put(
    "/movies/:id",
    authenticateToken,
    validateMovie,
    updateMovie
);

router.patch(
    "/movies/:id",
    authenticateToken,
    validateMoviePatch,
    patchMovie
);

router.delete(
    "/movies/:id",
    authenticateToken,
    deleteMovie
);


module.exports = router;