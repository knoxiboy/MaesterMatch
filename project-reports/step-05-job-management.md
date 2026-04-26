# Step 5 Report: Job Management

## Date: April 24, 2026

## What Was Built

In this step, we built the backend functionality for recruiters to manage
Job Postings in MaesterMatch. The purpose of this step is to establish the
criteria (specifically `requiredSkills`) against which we will match the
candidate resumes in the next step.

---

## Files Created / Modified

### 1. backend/models/Job.js (Created)

The Job schema stores the job descriptions.

**Key fields:**
- `title`: String, required.
- `description`: String, required.
- `requiredSkills`: Array of Strings. This is the crucial field that will be compared against the extracted skills from the parsed resumes.
- `experienceLevel`: Enum ("Entry Level", "Mid Level", "Senior Level", "Executive").
- `status`: Enum ("Open", "Closed", "Draft").
- `createdBy`: ObjectId referencing the `User` who created the job, ensuring recruiters can only see/manage their own postings.

---

### 2. backend/controllers/jobController.js (Created)

This controller provides full CRUD (Create, Read, Update, Delete) capabilities for Job Postings.

**Key functionality:**
- **Authorization Checks**: Throughout the controller, there are checks to ensure `req.user.role === "recruiter"` when creating a job, and that `job.createdBy.toString() === req.user.id` when fetching/updating/deleting specific jobs. This ensures data isolation between recruiters.
- `createJob`: Accepts job details in `req.body`, sets `createdBy` to the logged-in user's ID, and saves to MongoDB.
- `getJobs`: Fetches all jobs created by the logged-in user, sorted by newest first.
- `getJobById`: Fetches a single job.
- `updateJob`: Updates job details. Uses `runValidators: true` to ensure schema constraints are still met after the update.
- `deleteJob`: Removes a job posting.

---

### 3. backend/routes/jobRoutes.js (Created)

Maps standard RESTful routes to the controller functions.

| Method | Path | Middleware | Description |
|---|---|---|---|
| POST | /api/jobs | auth | Create a new job |
| GET | /api/jobs | auth | Get all jobs for user |
| GET | /api/jobs/:id | auth | Get a single job |
| PUT | /api/jobs/:id | auth | Update a job |
| DELETE | /api/jobs/:id | auth | Delete a job |

All routes are protected by the `protect` authentication middleware using `router.use(protect)`.

---

### 4. backend/server.js (Modified)

- Imported `jobRoutes` and mounted it at `/api/jobs`.

---

## How it works (End to End)

1. A recruiter (authenticated) makes a POST request to `/api/jobs` with the job details (including an array of `requiredSkills`).
2. The `protect` middleware verifies the JWT token.
3. The `jobController.createJob` function ensures the user is a recruiter, attaches their ID to the job payload, and saves it.
4. When we reach the next step (Matching Engine), we will use these saved `requiredSkills` to calculate a match percentage against the candidates in our database.

---

## Next Steps

With both Candidates (resumes) and Jobs (requirements) stored in the database, we are ready to build the **Matching Engine (Step 6)**, which will compare the two and calculate matching scores.
