# Step 7 Report: Frontend Setup (React, Vite, UI Structure)

## Date: April 24, 2026

## What Was Built

In this step, we transitioned from backend development to the frontend of
MaesterMatch. We set up the core React architecture using Vite, established
global state management for authentication, and created the foundational
pages with a premium, glassmorphism-inspired dark theme using Tailwind CSS
and Framer Motion.

---

## Files Created / Modified

### 1. frontend/src/index.css (Modified)

We replaced the default Vite CSS with a custom, premium design system.
**Key Design Elements:**
- **Color Palette:** Deep dark backgrounds (`#0b0f19`) with Indigo (`#6366f1`) and Pink (`#ec4899`) gradients for a modern, tech-forward look.
- **Glassmorphism:** Implemented `backdrop-filter: blur(12px)` on cards and navigation to create a frosted glass effect that looks highly premium.
- **Micro-interactions:** Added subtle hover states, translations (`translateY`), and box-shadow glows to make the interface feel responsive and alive.
- **Typography:** Used the `Inter` font family (or system defaults) for clean, legible text.

### 2. frontend/src/context/AuthContext.jsx (Created)

This context provides global authentication state and methods to the entire application.
**Key functionality:**
- Manages `user`, `token`, and `loading` state.
- Automatically attaches the JWT `token` to all outgoing Axios requests (`axios.defaults.headers.common["Authorization"]`).
- Fetches the user profile on load if a token exists in `localStorage`.
- Provides `login`, `signup`, and `logout` functions that interact directly with our Step 2/3 backend endpoints.

### 3. frontend/src/components/Navbar.jsx (Created)

A responsive navigation bar that sits at the top of the screen.
- Uses conditional rendering: Shows "Dashboard" and "Logout" if the user is authenticated, otherwise shows "Login" and "Get Started".

### 4. Pages (Created)

- **`Home.jsx`**: A stunning landing page with a clear value proposition, gradient text, and decorative glassmorphism elements illustrating the product's capabilities.
- **`Login.jsx` & `Signup.jsx`**: Authentication forms that use the `AuthContext` to log users in and handle error messages from the backend gracefully.
- **`Dashboard.jsx`**: A placeholder dashboard for authenticated recruiters. Currently displays mock statistics and quick action buttons.

### 5. frontend/src/App.jsx (Modified)

The root component that ties everything together.
- Wraps the application in `<AuthProvider>` and `<Router>`.
- Implements a `<PrivateRoute>` component to prevent unauthenticated users from accessing the `/dashboard`.
- Defines the routing structure mapping URLs to their respective Page components.

---

## How it works (End to End)

1. A user visits the root `/` path and sees the landing page (`Home.jsx`).
2. They click "Get Started" and navigate to `/signup`.
3. They fill out the form, which calls `signup()` in `AuthContext`.
4. `AuthContext` makes a POST request to `http://localhost:5000/api/auth/signup`.
5. The backend creates the user and returns a JWT token.
6. `AuthContext` saves the token to `localStorage`, sets the Axios default header, and fetches the user's profile.
7. The user is redirected to `/dashboard`. Since they now have a valid token, the `<PrivateRoute>` allows them access.

---

## Next Steps

Now that the frontend structure and authentication flow are in place, we can build the UI for the core functionality: **Job & Candidate UI (Step 8)**. We will create interfaces for creating job postings and uploading resumes.
