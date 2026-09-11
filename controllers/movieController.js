const { getDB } = require("../db");

// ========================================
// GET ALL MOVIES
// ========================================

const getAllMovies = async (req, res) => {
    try {
        const db = getDB();

     const {
    genre,
    minRating,
    sort,
    search,
    page = 1,
    limit = 10
} = req.query;

        const filter = {};

        // ========================================
        // GENRE FILTER
        // ========================================

        if (genre !== undefined) {

            if (
                typeof genre !== "string" ||
                genre.trim().length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    error: "INVALID_GENRE",
                    message: "❌ Genre query parameter cannot be empty."
                });
            }

            filter.genre = genre.trim();
            // ========================================
// TITLE SEARCH
// ========================================

if (search !== undefined) {

    if (
        typeof search !== "string" ||
        search.trim().length === 0
    ) {
        return res.status(400).json({
            success: false,
            error: "INVALID_SEARCH",
            message: "❌ Search query parameter cannot be empty."
        });
    }

    filter.title = {
        $regex: search.trim(),
        $options: "i"
    };
}
        }


        // ========================================
        // MINIMUM RATING FILTER
        // ========================================

        if (minRating !== undefined) {

            const rating = Number(minRating);

            if (
                Number.isNaN(rating) ||
                rating < 0 ||
                rating > 10
            ) {
                return res.status(400).json({
                    success: false,
                    error: "INVALID_MIN_RATING",
                    message: "⭐ minRating must be a number between 0 and 10."
                });
            }

            filter.rating = {
                $gte: rating
            };
        }


        // ========================================
        // PAGINATION VALIDATION
        // ========================================

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (
            !Number.isInteger(pageNumber) ||
            pageNumber < 1
        ) {
            return res.status(400).json({
                success: false,
                error: "INVALID_PAGE",
                message: "❌ page must be a positive integer."
            });
        }

        if (
            !Number.isInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100
        ) {
            return res.status(400).json({
                success: false,
                error: "INVALID_LIMIT",
                message: "❌ limit must be an integer between 1 and 100."
            });
        }


        // ========================================
        // SORTING
        // ========================================

        let sortOption = {};

        if (sort !== undefined) {

            if (sort === "rating") {

                // Highest rating first
                sortOption = {
                    rating: -1
                };

            } else if (sort === "rating_asc") {

                // Lowest rating first
                sortOption = {
                    rating: 1
                };

            } else {

                return res.status(400).json({
                    success: false,
                    error: "INVALID_SORT",
                    message: "❌ sort must be 'rating' or 'rating_asc'."
                });
            }
        }


        // ========================================
        // PAGINATION CALCULATION
        // ========================================

        const skip = (pageNumber - 1) * limitNumber;


        // ========================================
        // TOTAL MOVIES
        // ========================================

        const totalMovies = await db
            .collection("movies")
            .countDocuments(filter);


        // ========================================
        // FETCH MOVIES
        // ========================================

        const movies = await db
            .collection("movies")
            .find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber)
            .toArray();


        // ========================================
        // TOTAL PAGES
        // ========================================

        const totalPages = Math.ceil(
            totalMovies / limitNumber
        );


        // ========================================
        // RESPONSE
        // ========================================

        res.json({
            success: true,
            count: movies.length,

            pagination: {
                page: pageNumber,
                limit: limitNumber,
                totalMovies: totalMovies,
                totalPages: totalPages
            },

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

        // ========================================
        // ID VALIDATION
        // ========================================

        if (Number.isNaN(movieId)) {

            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }


        // ========================================
        // FIND MOVIE
        // ========================================

        const movie = await db
            .collection("movies")
            .findOne({
                id: movieId
            });


        // ========================================
        // MOVIE NOT FOUND
        // ========================================

        if (!movie) {

            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }


        // ========================================
        // RESPONSE
        // ========================================

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

        const {
            title,
            genre,
            rating
        } = req.body;


        // ========================================
        // REQUIRED FIELDS
        // ========================================

        if (
            !title ||
            !genre ||
            rating === undefined
        ) {

            return res.status(400).json({
                success: false,
                error: "MISSING_FIELDS",
                message: "❌ title, genre and rating are required."
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
        // FIND LAST MOVIE ID
        // ========================================

        const lastMovie = await db
            .collection("movies")
            .find({})
            .sort({
                id: -1
            })
            .limit(1)
            .toArray();


        // ========================================
        // GENERATE NEW ID
        // ========================================

        const newId = lastMovie.length > 0
            ? lastMovie[0].id + 1
            : 1;


        // ========================================
        // NEW MOVIE OBJECT
        // ========================================

        const newMovie = {
            id: newId,
            title: title,
            genre: genre,
            rating: rating
        };


        // ========================================
        // INSERT MOVIE
        // ========================================

        await db
            .collection("movies")
            .insertOne(newMovie);


        // ========================================
        // RESPONSE
        // ========================================

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


        // ========================================
        // ID VALIDATION
        // ========================================

        if (Number.isNaN(movieId)) {

            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }


        const {
            title,
            genre,
            rating
        } = req.body;


        // ========================================
        // REQUIRED FIELDS
        // ========================================

        if (
            !title ||
            !genre ||
            rating === undefined
        ) {

            return res.status(400).json({
                success: false,
                error: "MISSING_FIELDS",
                message: "❌ title, genre and rating are required."
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
        // UPDATE MOVIE
        // ========================================

        const result = await db
            .collection("movies")
            .updateOne(
                {
                    id: movieId
                },
                {
                    $set: {
                        title: title,
                        genre: genre,
                        rating: rating
                    }
                }
            );


        // ========================================
        // MOVIE NOT FOUND
        // ========================================

        if (result.matchedCount === 0) {

            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }


        // ========================================
        // GET UPDATED MOVIE
        // ========================================

        const updatedMovie = await db
            .collection("movies")
            .findOne({
                id: movieId
            });


        // ========================================
        // RESPONSE
        // ========================================

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


        // ========================================
        // ID VALIDATION
        // ========================================

        if (Number.isNaN(movieId)) {

            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }


        const {
            title,
            genre,
            rating
        } = req.body;


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
        // BUILD UPDATE OBJECT
        // ========================================

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


        // ========================================
        // NO FIELDS
        // ========================================

        if (Object.keys(updates).length === 0) {

            return res.status(400).json({
                success: false,
                error: "NO_FIELDS",
                message: "❌ Provide at least one field to update."
            });
        }


        // ========================================
        // UPDATE MOVIE
        // ========================================

        const result = await db
            .collection("movies")
            .updateOne(
                {
                    id: movieId
                },
                {
                    $set: updates
                }
            );


        // ========================================
        // MOVIE NOT FOUND
        // ========================================

        if (result.matchedCount === 0) {

            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }


        // ========================================
        // GET UPDATED MOVIE
        // ========================================

        const updatedMovie = await db
            .collection("movies")
            .findOne({
                id: movieId
            });


        // ========================================
        // RESPONSE
        // ========================================

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


        // ========================================
        // ID VALIDATION
        // ========================================

        if (Number.isNaN(movieId)) {

            return res.status(400).json({
                success: false,
                error: "INVALID_ID",
                message: "❌ Movie ID must be a number."
            });
        }


        // ========================================
        // FIND MOVIE
        // ========================================

        const movie = await db
            .collection("movies")
            .findOne({
                id: movieId
            });


        // ========================================
        // MOVIE NOT FOUND
        // ========================================

        if (!movie) {

            return res.status(404).json({
                success: false,
                error: "MOVIE_NOT_FOUND",
                message: `🎬 Movie with ID ${movieId} was not found.`
            });
        }


        // ========================================
        // DELETE MOVIE
        // ========================================

        await db
            .collection("movies")
            .deleteOne({
                id: movieId
            });


        // ========================================
        // RESPONSE
        // ========================================

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