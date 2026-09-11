const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

let database;

async function connectDB() {
    try {
        await client.connect();

        database = client.db("moviebattle");

        console.log("🍃 MongoDB connected successfully!");

        return database;

    } catch (error) {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);

        process.exit(1);
    }
}

function getDB() {
    if (!database) {
        throw new Error("❌ Database is not connected yet.");
    }

    return database;
}

module.exports = {
    connectDB,
    getDB
};