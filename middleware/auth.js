const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: "AUTH_TOKEN_REQUIRED",
            message: "❌ Authentication token is required."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "INVALID_AUTH_HEADER",
            message: "❌ Invalid Authorization header."
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            error: "INVALID_TOKEN",
            message: "❌ Invalid or expired token."
        });
    }
};

module.exports = authenticateToken;