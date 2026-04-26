# Step 3 Report: Auth Middleware and Routes

## Date: April 24, 2026

## What Was Built

In this step, we created the JWT authentication middleware and defined the
auth routes for MaesterMatch. We also wired the routes into the main server
file. After this step, the signup, login, and profile API endpoints are
fully functional.

---

## Files Created / Modified

### 1. backend/middleware/authMiddleware.js (Created)

This middleware function runs before protected route handlers. Its job is to
verify that the incoming request has a valid JWT token.

**How it works:**
1. The function reads the `Authorization` header from the HTTP request
2. It checks if the header exists and follows the format "Bearer <token>"
3. It extracts the token string by splitting on the space character
4. It calls `jwt.verify(token, secret)` to validate the token
5. If valid, the decoded payload (containing the user ID) is attached to
   `req.user`, and `next()` is called to continue to the route handler
6. If invalid or expired, it returns a 401 Unauthorized response

**What is middleware?**
In Express, middleware is a function that has access to the request object
(req), the response object (res), and the next function (next). Middleware
functions can:
- Execute code
- Modify the request or response objects
- End the request-response cycle
- Call the next middleware in the chain

When we write `router.get("/profile", authMiddleware, getProfile)`, Express
first runs `authMiddleware`. If it calls `next()`, then `getProfile` runs.
If it sends a response instead (like a 401 error), `getProfile` never runs.

---

### 2. backend/routes/authRoutes.js (Created)

This file defines three routes using Express Router:

| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| POST | /api/auth/signup | None | signup | Create a new account |
| POST | /api/auth/login | None | login | Log in and get a token |
| GET | /api/auth/profile | authMiddleware | getProfile | Get user profile |

**Why use Express Router?**
Express Router lets us group related routes in separate files. Instead of
defining all routes directly in server.js, we create router modules and
mount them with `app.use("/api/auth", authRoutes)`. This keeps the code
organized as the application grows.

---

### 3. backend/server.js (Modified)

We imported the auth routes and mounted them:
```javascript
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
```

The `app.use("/api/auth", authRoutes)` call tells Express: "For any request
that starts with /api/auth, use the routes defined in authRoutes." So when
a POST request comes in to `/api/auth/signup`, Express matches it and calls
the `signup` controller function.

---

## Request Flow Diagram

Here is what happens when a user tries to sign up:

```
Client sends POST /api/auth/signup with { username, email, password }
    |
    v
Express receives the request
    |
    v
cors() middleware runs (allows the request)
    |
    v
express.json() middleware runs (parses JSON body)
    |
    v
Router matches /api/auth/signup -> signup controller
    |
    v
signup() checks fields, hashes password, saves to DB, returns token
    |
    v
Client receives { message, token, user }
```

And here is what happens for a protected route like /api/auth/profile:

```
Client sends GET /api/auth/profile with Authorization: Bearer <token>
    |
    v
Router matches /api/auth/profile -> authMiddleware -> getProfile
    |
    v
authMiddleware extracts and verifies the token
    |
    v (if valid)
req.user = { id: "..." } is set, next() is called
    |
    v
getProfile() uses req.user.id to find and return the user
```

---

## How to Test with Postman

### Test 1: Signup
- Method: POST
- URL: http://localhost:5000/api/auth/signup
- Body (JSON):
```json
{
  "username": "Priya",
  "email": "priya@example.com",
  "password": "password123"
}
```
- Expected Response (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiI...",
  "user": {
    "id": "...",
    "username": "Priya",
    "email": "priya@example.com",
    "role": "recruiter"
  }
}
```

### Test 2: Login
- Method: POST
- URL: http://localhost:5000/api/auth/login
- Body (JSON):
```json
{
  "email": "priya@example.com",
  "password": "password123"
}
```

### Test 3: Get Profile (Protected)
- Method: GET
- URL: http://localhost:5000/api/auth/profile
- Headers: Authorization: Bearer <token from login>

---

## Technologies Used

| Technology | Purpose |
|---|---|
| jsonwebtoken | Verify JWT tokens in the middleware |
| Express Router | Organize routes into separate modules |
