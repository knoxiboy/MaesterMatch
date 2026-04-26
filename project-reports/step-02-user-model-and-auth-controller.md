# Step 2 Report: User Model and Authentication Controller

## Date: April 24, 2026

## What Was Built

In this step, we created the User data model and the authentication controller
that handles user registration (signup) and login functionality for the
MaesterMatch ecosystem.
---
## Files Created
### 1. backend/models/User.js
This file defines the structure of user documents in our MongoDB database.
**Schema Fields:**
- `username` (String, required) - The user's display name. We use `trim`
  to remove any extra whitespace from the input.
- `email` (String, required, unique) - Used for login. The `unique` flag
  creates a database index that prevents duplicate emails. The `lowercase`
  flag converts all emails to lowercase before saving, so "Test@email.com"
  and "test@email.com" are treated as the same.
- `password` (String, required, min 6 chars) - Stored as a bcrypt hash, never
  as plain text. The minimum length validation runs before hashing.
- `role` (String, enum) - Either "recruiter", "candidate", or "admin".
  Defaults to "candidate". The `enum` validator ensures only these values
  are accepted. "Recruiter" users manage job postings and mass resume parsing,
  while "candidate" users get access to AI-powered resume analysis.
- `timestamps` option - Mongoose automatically adds `createdAt` and
  `updatedAt` fields to every document.

**How Mongoose Models Work:**
When we call `mongoose.model("User", userSchema)`, Mongoose:
1. Takes the name "User" and creates a collection called "users" (lowercase,
   pluralized) in MongoDB
2. Returns a constructor function we can use to create and query documents
3. Validates data against the schema before saving to the database

---

### 2. backend/controllers/authController.js

This file contains three functions that handle the authentication logic.

**Function: signup(req, res)**
1. Reads username, email, and password from the request body
2. Validates that all fields are present
3. Checks if the email is already registered by querying the database
4. Hashes the password using bcrypt with 10 salt rounds
5. Creates a new User document and saves it to MongoDB
6. Generates a JWT token so the user is logged in immediately
7. Returns the token and user data (without the password)

**Function: login(req, res)**
1. Reads email and password from the request body
2. Finds the user by email in the database
3. Uses bcrypt.compare to verify the password against the stored hash
4. If valid, generates a JWT token
5. Returns the token and user data

**Function: getProfile(req, res)**
1. Uses the user ID from `req.user` (set by auth middleware, built in Step 3)
2. Queries the database for the user, excluding the password field
3. Returns the user data

---

## Key Concepts Explained

### Password Hashing with Bcrypt

We never store passwords as plain text. Bcrypt is a one-way hashing algorithm:

```
Plain text: "mypassword123"
     |
     v  bcrypt.hash(password, 10)
     |
Hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
```

The number 10 is the "salt rounds" - it controls how many times the hashing
algorithm runs. Higher values are more secure but take longer. 10 is the
standard for most applications.

When a user logs in, we use `bcrypt.compare()` which hashes the input and
compares it with the stored hash. We never "decrypt" the password.

### JWT (JSON Web Tokens)

After successful login, we generate a JWT token:

```
jwt.sign({ id: user._id }, secret, { expiresIn: "7d" })
```

The token contains the user's ID, is signed with our secret key, and expires
after 7 days. The frontend stores this token and sends it with every request
so the backend knows who is making the request.

A JWT token has three parts separated by dots:
```
header.payload.signature
```
- Header: specifies the algorithm (HS256)
- Payload: contains the user ID and expiration time
- Signature: ensures the token has not been tampered with

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Mongoose | Define User schema and interact with MongoDB |
| bcryptjs | Hash and verify passwords securely |
| jsonwebtoken | Generate and verify JWT authentication tokens |

---

## How to Test

These functions cannot be tested directly yet because we have not created the
routes or middleware. That will happen in Step 3. After Step 3, we can test
signup and login using Postman.
