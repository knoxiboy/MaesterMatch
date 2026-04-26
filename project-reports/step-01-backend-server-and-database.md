# Step 1 Report: Backend Server and Database Connection

## Date: April 24, 2026

## What Was Built

In this step, we created the foundation of MaesterMatch. Three files
were created to establish the Express server and connect it to MongoDB.

---

## Files Created

### 1. backend/config/db.js

This file is responsible for connecting our application to the MongoDB database.

**How it works:**
- We import the `mongoose` library, which is an ODM (Object Document Mapper)
  for MongoDB. It lets us define schemas and interact with the database using
  JavaScript objects instead of raw MongoDB queries.
- The `connectDB` function is asynchronous because `mongoose.connect()` returns
  a Promise. It takes the MongoDB connection string from our environment
  variables (`process.env.MONGODB_URI`).
- If the connection succeeds, it logs the host name of the connected database.
- If it fails, it logs the error and calls `process.exit(1)` to stop the
  server. This is intentional because the application cannot function without
  a database.

**Why Mongoose?**
Mongoose provides a structured way to define what data looks like in our
collections (through schemas), adds validation, and gives us convenient methods
for querying. Without it, we would have to write raw MongoDB driver code which
is more verbose and harder to maintain.

---

### 2. backend/server.js

This is the main entry point of our backend. When we run `npm start` or
`npm run dev`, Node.js executes this file.

**How it works (line by line breakdown):**
1. We import Express (our web framework), CORS, dotenv, and our database
   connection function.
2. `dotenv.config()` reads the `.env` file and loads all the key-value pairs
   into `process.env`. This must happen before we access any environment
   variables.
3. `connectDB()` is called to establish the MongoDB connection.
4. We create an Express application with `express()`.
5. Three middleware functions are applied:
   - `cors()` allows the frontend (running on a different port like 5173) to
     send requests to our backend on port 5000. Without this, browsers would
     block the requests due to the Same-Origin Policy.
   - `express.json()` parses incoming requests with JSON payloads. This means
     when the frontend sends `{ "email": "test@example.com" }` in the request
     body, Express automatically converts it into a JavaScript object we can
     access via `req.body`.
   - `express.urlencoded({ extended: true })` parses URL-encoded form data
     (like data from HTML forms).
6. A health check route at `/api/health` responds with a simple JSON message.
   This is useful for verifying the server is running without needing any
   other features.
7. The server starts listening on the port specified in the `.env` file
   (defaults to 5000 if not set).

**Why Express?**
Express is the most widely used Node.js web framework. It simplifies routing,
middleware handling, and HTTP request/response management. It has a large
community and plenty of documentation, making it a good choice for learning
backend development.

---

### 3. backend/.env

This file stores configuration values that should not be hardcoded in our
source code.

**Variables:**
- `PORT=5000` - The port number our server listens on
  database named "maestermatch". For production, this would be replaced with
  a MongoDB Atlas cloud URI.
  a MongoDB Atlas cloud URI.
- `JWT_SECRET` - A secret key used to sign JWT tokens (used later in auth)
- `JWT_EXPIRE=7d` - How long a JWT token remains valid (7 days)

**Why .env files?**
Environment variables keep sensitive data (like database passwords and secret
keys) out of our source code. The `.env` file is listed in `.gitignore` so it
never gets committed to Git. Each developer sets up their own `.env` file
locally.

---

## Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| Express.js | 5.x | Web framework for handling HTTP requests |
| Mongoose | 9.x | ODM for MongoDB, provides schemas and models |
| cors | 2.x | Enables cross-origin requests from frontend |
| dotenv | 17.x | Loads environment variables from .env file |

---

## How to Test

1. Make sure MongoDB is running locally (or update MONGODB_URI to your Atlas URI)
2. Navigate to the backend folder: `cd backend`
3. Start the server: `npm run dev`
4. Open a browser and visit: `http://localhost:5000/api/health`
5. You should see: `{"status":"ok","message":"Server is running"}`
6. In the terminal, you should see:
   - "MongoDB connected: localhost" (or your Atlas host)
   - "Server running on port 5000"

---

## Architecture Context

This step sets up the bottom two layers of our three-tier architecture:

```
Frontend (React) -- not yet built
    |
Backend (Express) -- server.js created in this step
    |
Database (MongoDB) -- db.js connects to it in this step
```

All future backend code (models, controllers, routes) will be wired into
server.js. The architecture is designed to be modular, allowing us to swap
out the rule-based engine or add AI services like Puter AI without breaking
core functionality.
