const { getDB } = require("../db");


// ========================================
// USERS COLLECTION
// ========================================

function getUsersCollection() {

    const db = getDB();

    return db.collection("users");
}


// ========================================
// FIND USER BY USERNAME
// ========================================

async function findUserByUsername(username) {

    const users = getUsersCollection();

    return await users.findOne({
        username: username
    });
}


// ========================================
// CREATE USER
// ========================================

async function createUser(userData) {

    const users = getUsersCollection();

    return await users.insertOne(userData);
}


module.exports = {
    getUsersCollection,
    findUserByUsername,
    createUser
};