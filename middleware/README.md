# 🎬 Movie Battle API

A RESTful API built with Node.js, Express.js, and MongoDB.

This project is created for learning and practicing REST API development, CRUD operations, middleware, validation, error handling, database integration, and API security.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Postman
- Helmet
- Express Rate Limit
- dotenv

---

## 📁 Project Structure

```text
my-first-api/
│
├── controllers/
│   └── movieController.js
│
├── routes/
│   └── movieRoutes.js
│
├── middleware/
│   ├── movieValidation.js
│   ├── moviePatchValidation.js
│   ├── errorHandler.js
│   └── notFound.js
│
├── .env
├── .gitignore
├── db.js
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

⚠️ Never share your MongoDB username or password publicly.

The `.env` file should be included in `.gitignore`.

---

## ▶️ Run the API

Start the server with:

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

---

# 🎬 Movie API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | Get all movies |
| GET | `/movies/:id` | Get a single movie |
| POST | `/movies` | Create a new movie |
| PUT | `/movies/:id` | Complete movie update |
| PATCH | `/movies/:id` | Partial movie update |
| DELETE | `/movies/:id` | Delete a movie |

---

# 🏠 Home Endpoint

## GET /

Returns a welcome message from the API.

### Request

```http
GET http://localhost:3000/
```

### Status Code

```text
200 OK
```

---

# 1️⃣ Get All Movies

## GET /movies

Returns all movies stored in the MongoDB database.

### Request

```http
GET http://localhost:3000/movies
```

### Status Code

```text
200 OK
```

---

# 2️⃣ Get Movie By ID

## GET /movies/:id

Returns a single movie using its movie ID.

### Request

```http
GET http://localhost:3000/movies/1
```

Here:

```text
1 → Movie ID
```

### Possible Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Movie found |
| `400` | Invalid movie ID |
| `404` | Movie not found |
| `500` | Server/database error |

---

# 3️⃣ Create a New Movie

## POST /movies

Creates a new movie and stores it in MongoDB.

### Request

```http
POST http://localhost:3000/movies
```

### Headers

```text
Content-Type: application/json
```

### Request Body

```json
{
    "title": "The Dark Knight",
    "genre": "Action",
    "rating": 9.0
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Movie title |
| `genre` | String | Yes | Movie genre |
| `rating` | Number | Yes | Rating from 0 to 10 |

### Status Codes

| Status | Meaning |
|--------|---------|
| `201` | Movie created |
| `400` | Invalid request data |
| `500` | Server/database error |

---

# 4️⃣ Complete Movie Update

## PUT /movies/:id

Updates the complete movie information.

PUT requires all movie fields.

### Request

```http
PUT http://localhost:3000/movies/1
```

### Headers

```text
Content-Type: application/json
```

### Request Body

```json
{
    "title": "Interstellar Updated",
    "genre": "Sci-Fi",
    "rating": 9.8
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Movie title |
| `genre` | String | Yes | Movie genre |
| `rating` | Number | Yes | Rating from 0 to 10 |

### Important

PUT replaces the complete movie information.

Therefore, all three fields must be provided:

```text
title + genre + rating
```

### Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Movie updated |
| `400` | Invalid request data |
| `404` | Movie not found |
| `500` | Server/database error |

---

# 5️⃣ Partial Movie Update

## PATCH /movies/:id

Updates only the fields provided in the request.

Unlike PUT, PATCH does not require all fields.

### Request

```http
PATCH http://localhost:3000/movies/1
```

### Headers

```text
Content-Type: application/json
```

### Example Request Body

Only rating:

```json
{
    "rating": 9.9
}
```

Only title:

```json
{
    "title": "Interstellar Final"
}
```

Multiple fields:

```json
{
    "title": "Interstellar Final",
    "rating": 9.9
}
```

### Available Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | No | Movie title |
| `genre` | String | No | Movie genre |
| `rating` | Number | No | Rating from 0 to 10 |

At least one field must be provided.

### Important

PATCH only changes the fields included in the request.

### Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Movie updated |
| `400` | Invalid request data |
| `404` | Movie not found |
| `500` | Server/database error |

---

# 6️⃣ Delete a Movie

## DELETE /movies/:id

Deletes a movie from MongoDB using its movie ID.

### Request

```http
DELETE http://localhost:3000/movies/1
```

Here:

```text
1 → Movie ID
```

### Request Body

No request body is required.

### Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Movie deleted |
| `400` | Invalid movie ID |
| `404` | Movie not found |
| `500` | Server/database error |

### Important

Deletion is permanent.

Once a movie is deleted, it will no longer be returned by:

```http
GET /movies
```

---

# 🛡️ Validation

The API validates movie data before creating or updating movies.

## Movie Fields

| Field | Type | Rules |
|-------|------|-------|
| `title` | String | Required for POST/PUT, 1–100 characters |
| `genre` | String | Required for POST/PUT, 1–50 characters |
| `rating` | Number | Required for POST/PUT, 0–10 |

## POST and PUT

The following fields are required:

```text
title
genre
rating
```

## PATCH

PATCH allows partial updates, but at least one field must be provided.

## Input Cleaning

Leading and trailing spaces are removed from:

- `title`
- `genre`

Example:

```text
"   Interstellar   "
        ↓
"Interstellar"
```

---

# ❌ Error Handling

The API uses consistent error responses for invalid requests, missing resources, and server errors.

## Common Errors

| Error | Status | Meaning |
|-------|--------|---------|
| `MISSING_FIELDS` | 400 | Required fields are missing |
| `INVALID_TITLE` | 400 | Title is invalid |
| `INVALID_GENRE` | 400 | Genre is invalid |
| `INVALID_RATING` | 400 | Rating is outside the allowed range |
| `INVALID_ID` | 400 | Movie ID must be a number |
| `NO_FIELDS` | 400 | No fields provided for PATCH |
| `MOVIE_NOT_FOUND` | 404 | Movie does not exist |
| `ROUTE_NOT_FOUND` | 404 | Requested route does not exist |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

# 🔐 Security

The API includes basic security protections.

## Helmet

Helmet adds common HTTP security headers to API responses.

## Rate Limiting

The API limits excessive requests to help reduce basic API abuse.

## Environment Variables

Sensitive configuration such as the MongoDB connection string is stored in `.env`.

The `.env` file should never be committed to a public repository.

## Unique Movie IDs

MongoDB uses a unique index on the `id` field to prevent duplicate movie IDs.

---

# 🗄️ Database

MongoDB Atlas is used as the database.

### Database

```text
moviebattle
```

### Collection

```text
movies
```

### Movie Structure

```json
{
    "id": 1,
    "title": "Interstellar",
    "genre": "Sci-Fi",
    "rating": 9.2
}
```

MongoDB also automatically provides an `_id` field for each document.

---

# 🧪 Testing

Postman can be used to test all API endpoints.

Recommended testing order:

```text
GET
 ↓
GET by ID
 ↓
POST
 ↓
PUT
 ↓
PATCH
 ↓
DELETE
```

The API has been tested for:

- CRUD operations
- Request validation
- Invalid movie IDs
- Missing fields
- Invalid ratings
- Partial updates
- Missing routes
- Error handling
- MongoDB persistence

---

# 📌 HTTP Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Successful request |
| `201` | Resource created |
| `400` | Bad request |
| `404` | Resource/route not found |
| `429` | Too many requests |
| `500` | Internal server error |

---

# 🎯 Learning Goals

This project demonstrates:

- REST API fundamentals
- HTTP methods
- Express.js
- Routing
- Controllers
- Middleware
- Request validation
- Input sanitization
- Error handling
- MongoDB integration
- CRUD operations
- Environment variables
- API security
- Rate limiting
- Postman API testing

---

# 👨‍💻 Author

Movie Battle API — REST API learning project.