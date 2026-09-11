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

// Middleware
const validateMovie = require("../middleware/movieValidation");
const validateMoviePatch = require("../middleware/moviePatchValidation");


// ========================================
// GET ALL MOVIES
// ========================================

router.get("/movies", getAllMovies);


// ========================================
// GET SINGLE MOVIE
// ========================================

router.get("/movies/:id", getMovieById);


// ========================================
// CREATE NEW MOVIE
// ========================================

router.post("/movies", validateMovie, createMovie);


// ========================================
// UPDATE COMPLETE MOVIE
// ========================================

router.put("/movies/:id", validateMovie, updateMovie);


// ========================================
// UPDATE PARTIAL MOVIE
// ========================================

router.patch(
    "/movies/:id",
    validateMoviePatch,
    patchMovie
);


// ========================================
// DELETE MOVIE
// ========================================

router.delete("/movies/:id", deleteMovie);


module.exports = router;