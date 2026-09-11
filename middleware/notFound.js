const notFound = (req, res, next) => {

    res.status(404).json({
        success: false,
        error: "ROUTE_NOT_FOUND",
        message: `❌ Route ${req.method} ${req.originalUrl} not found.`
    });
};

module.exports = notFound;