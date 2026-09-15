const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "Movie Battle API",
        version: "1.0.0",
        description: "Movie Battle REST API"
    },

    servers: [
        {
            url: "http://localhost:3000"
        }
    ],

    paths: {
        "/": {
            get: {
                summary: "API Home",
                responses: {
                    200: {
                        description: "API is running"
                    }
                }
            }
        },

        "/register": {
            post: {
                summary: "Register user",
                responses: {
                    201: {
                        description: "User registered successfully"
                    }
                }
            }
        },

        "/login": {
            post: {
                summary: "Login user",
                responses: {
                    200: {
                        description: "Login successful"
                    }
                }
            }
        },

        "/movies": {
            get: {
                summary: "Get all movies",
                responses: {
                    200: {
                        description: "Movies retrieved successfully"
                    }
                }
            },

            post: {
                summary: "Create movie",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    201: {
                        description: "Movie created successfully"
                    },
                    401: {
                        description: "Authentication required"
                    }
                }
            }
        },

        "/movies/{id}": {
            get: {
                summary: "Get movie by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Movie found"
                    },
                    404: {
                        description: "Movie not found"
                    }
                }
            }
        }
    },

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    }
};

module.exports = {
    swaggerUi,
    swaggerDocument
};