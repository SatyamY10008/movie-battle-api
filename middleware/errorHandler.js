const errorHandler = (err, req, res, next) => {

    console.error("❌ ERROR:", err.message);

    res.status(500).json({
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "❌ Something went wrong on the server."
    });
};

module.exports = errorHandler;