# Step 6 Report: Matching Engine

## Date: April 24, 2026

## What Was Built

In this step, we built the core business logic of MaesterMatch: The Resume
Matching Engine. This engine takes a specific Job ID, compares its required
skills against the extracted skills of all candidates uploaded by the
recruiter, and returns a sorted list of matches.

---

## Files Created / Modified

### 1. backend/controllers/matchController.js (Created)

This is the brain of the matching engine.

**Key functionality:**
- `calculateMatchScore(candidateSkills, requiredSkills)`: A helper function
  that performs case-insensitive comparisons between the two skill arrays.
  
  **The Formula:**
  ```
  Match Score = (Matched Skills Count / Required Skills Count) * 100
  ```
  Where `Matched Skills` is the intersection of the candidate's extracted
  skills and the job's requirement list.

- `getJobMatches(req, res)`:
  1. Validates the `jobId` and ensures the logged-in user owns the job.
  2. Fetches all candidates uploaded by the logged-in user (excluding the heavy `rawText` field for performance).
  3. Iterates over each candidate and calculates their match score against the job's `requiredSkills`.
  4. Appends the `matchScore` property to the candidate objects.
  5. Sorts the array of candidates in descending order based on `matchScore` (best matches first).
  6. Returns the sorted list along with the job title and required skills for context.

---

### 2. backend/routes/matchRoutes.js (Created)

Maps standard RESTful routes to the controller function.

| Method | Path | Middleware | Description |
|---|---|---|---|
| GET | /api/matches/:jobId | auth | Get candidates matching a job |

The route is protected by the `protect` authentication middleware using `router.use(protect)`.

---

### 3. backend/server.js (Modified)

- Imported `matchRoutes` and mounted it at `/api/matches`.

---

## How it works (End to End)

1. A recruiter navigates to a job posting and wants to see matched candidates.
2. The frontend sends a GET request to `/api/matches/<jobId>`.
3. The `matchController` gets the job's `requiredSkills` (e.g., `["React", "Node.js", "MongoDB"]`).
4. It fetches all the recruiter's candidates.
5. For each candidate, it checks their `skills` array (extracted during Step 4).
   - If Candidate A has `["React", "HTML", "CSS"]`, they have 1/3 required skills = 33% match.
   - If Candidate B has `["React", "Node.js", "Express", "MongoDB"]`, they have 3/3 required skills = 100% match.
6. The candidates are sorted, so Candidate B appears before Candidate A.
7. The sorted list is sent back to the frontend.

---

## Next Steps

With the entire backend core functionality now complete (Auth, Resumes, Jobs, Matching), we are ready to move to the **Frontend Setup (Step 7)**. We will initialize the React app, set up Tailwind CSS (or standard CSS if preferred), and configure React Router for navigation.
