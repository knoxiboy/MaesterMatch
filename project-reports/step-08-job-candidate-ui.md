# Step 8 Report: Job & Candidate UI

## Date: April 24, 2026

## What Was Built

In this step, we built the specific frontend interfaces that interact with
our Step 4 (Resume Parsing) and Step 5 (Job Management) backend routes.
Recruiters can now visually create job postings and upload resume files
using a custom-built, drag-and-drop enabled UI in MaesterMatch.

---

## Files Created / Modified

### 1. frontend/src/pages/CreateJob.jsx (Created)

This component provides a form for recruiters to define a new job.
**Key functionality:**
- Uses controlled inputs for `title`, `description`, and `experienceLevel`.
- **Skills Processing:** The `skillsInput` field accepts a comma-separated string (e.g., "React, Node.js, AWS"). Before submitting, the `handleSubmit` function splits this string by commas, trims whitespace, and filters out empty strings to create a clean array of `requiredSkills` which matches the backend schema.
- Posts the payload to `/api/jobs`.
- On success, redirects the user back to the `/dashboard`.

### 2. frontend/src/pages/UploadResume.jsx (Created)

This is the core interface for the parsing engine.
**Key functionality:**
- Uses a hidden `<input type="file">` wrapped in a stylized `<label>` to create a large, clickable dropzone area.
- **Frontend Validation:** The `handleFileChange` function checks if the file is larger than 5MB and ensures the MIME type is either PDF or DOCX. If it fails, an error is shown before the file is even sent to the server.
- **Multipart Form Data:** Uses the native `FormData` API to append the `resume` file and sends it with the `Content-Type: multipart/form-data` header to `/api/resumes/upload`.
- **Results Display:** Upon successful upload and parsing, the backend returns the structured data. The component then renders the extracted `name`, `email`, `phone`, and a visual tag list of the extracted `skills`.

### 3. frontend/src/App.jsx (Modified)

- Imported the new `CreateJob` and `UploadResume` components.
- Mapped them to the `/jobs/new` and `/upload` routes respectively.
- Wrapped both in the `<PrivateRoute>` component so they are only accessible to authenticated users.

---

## How it works (End to End)

**Creating a Job:**
1. Recruiter clicks "Create Job Posting" on the Dashboard.
2. They are taken to `/jobs/new`.
3. They fill out the details and click "Create Job".
4. The frontend sends an Axios request, the backend creates the Job document, and the user is redirected back.

**Uploading a Resume:**
1. Recruiter clicks "Upload Resumes" on the Dashboard.
2. They are taken to `/upload`.
3. They click the dropzone, select a PDF, and click "Upload & Parse".
4. A loading state is shown while the file is sent to the backend.
5. The backend parses the text, extracts the details, saves the candidate, and responds.
6. The frontend displays a success message and shows the extracted skills directly on the screen.

---

## Next Steps

Now we have data flowing in. The next step is **Dashboard Integration (Step 9)**, where we will replace the mock data on the Dashboard with live data. We will fetch the list of Jobs and Candidates from the backend and display them in interactive tables or cards.
