# Step 4 Report: Resume Upload and Parsing System

## Date: April 24, 2026

## What Was Built

This is the most important step in the MaesterMatch core. We built the system
that accepts resume files (PDF or DOCX), extracts text from them, and then
uses pattern matching to pull out structured data like name, email, skills,
education, and work experience.

---

## Files Created / Modified

### 1. backend/services/resumeParser.js (Created)

This is the core parsing logic. It has two main parts:

**Part A: Text Extraction**
- `extractTextFromPDF(filePath)` - Uses the `pdf-parse` library. It reads
  the file into a binary buffer, then pdf-parse decodes the PDF format and
  returns the plain text content.
- `extractTextFromDOCX(filePath)` - Uses the `mammoth` library. DOCX files
  are actually ZIP archives containing XML. Mammoth reads the XML and
  extracts the text content.
- `extractText(filePath)` - A wrapper function that checks the file extension
  and calls the appropriate extraction function.

**Part B: Data Extraction (from raw text)**

After we have the plain text, we use regular expressions and keyword matching:

- `extractName(text)` - Scans the first 5 lines looking for something that
  looks like a name (2-4 words, only letters and spaces). Most resumes have
  the candidate's name as the first line.

- `extractEmail(text)` - Uses a regex pattern to find email addresses:
  `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/`
  This matches patterns like "user@domain.com"

- `extractPhone(text)` - Uses a regex to find phone numbers in various
  formats like "+91-9876543210" or "(123) 456-7890"

- `extractSkills(text)` - Compares the resume text against a predefined
  list of ~80 technical skills. For each skill in our database, we check
  if it appears in the resume text. Short skills (like "c" or "r") use
  word boundary regex to avoid false positives.

- `extractEducation(text)` - Looks for lines containing degree keywords
  like "B.Tech", "MBA", "Bachelor", etc. Also tries to find a year on
  the same line.

- `extractExperience(text)` - Finds the "Experience" section header, then
  tries to parse job entries by looking for date ranges like "2020 - 2022"
  followed by job titles and company names.

**Skills Database:**
We maintain a list of ~80 common technical skills. The parser matches
resume text against this list. This is simpler and more reliable for
high-speed bulk matching than trying to use NLP/AI for every extraction.

---

### 2. Candidate Portal Integration: AI-Powered Analysis

While the backend uses rule-based parsing for speed and matching, the
Candidate Portal integrates **Puter AI (Claude 3.5 Sonnet)** for qualitative
feedback.

**The Hybrid Approach:**
- **Backend (Rule-Based)**: Used for calculating the "Match Score" against
  specific job descriptions. It is deterministic and fast.
- **Frontend (AI-Powered)**: Uses the `puter.js` service to provide an
  "Elite Senior Hiring Manager" review. It analyzes tone, structure, and
  provides specific transformation tips (e.g., using the Action Verb + Task
  + Result formula).

---

### 3. backend/models/Candidate.js (Created)

The Candidate schema stores the parsed resume data.

**Key design decisions:**
- `education` and `experience` are arrays of sub-documents. This lets a
  single candidate have multiple education entries and multiple jobs.
- `rawText` stores the full extracted text so we can re-parse later or
  search through it.
- `uploadedBy` references the User who uploaded this resume, creating a
  one-to-many relationship.
- `resumeFile` stores just the filename (not the full path) for the
  uploaded file.

---

### 3. backend/controllers/resumeController.js (Created)

This controller handles all resume-related operations.

**Multer Configuration:**
- `storage` - Files are saved to the `/uploads` directory with a timestamp
  prefix to avoid name collisions (e.g., "1713900000000-resume.pdf")
- `fileFilter` - Only accepts PDF and DOCX MIME types
- `limits` - Maximum file size is 5MB

**Controller Functions:**
- `uploadResume` - Handles the POST /upload request. It receives the file
  from Multer, calls parseResume() to extract data, creates a Candidate
  document, and saves it to MongoDB.
- `getCandidates` - Lists all candidates for the logged-in recruiter,
  sorted by newest first. Excludes rawText to keep responses small.
- `getCandidateById` - Returns full details for a single candidate.
- `deleteCandidate` - Removes a candidate from the database.

---

### 4. backend/routes/resumeRoutes.js (Created)

| Method | Path | Middleware | Description |
|---|---|---|---|
| POST | /api/resumes/upload | auth, multer | Upload and parse a resume |
| GET | /api/resumes/candidates | auth | List all candidates |
| GET | /api/resumes/candidates/:id | auth | Get candidate details |
| DELETE | /api/resumes/candidates/:id | auth | Delete a candidate |

Note that the upload route has two middleware functions chained:
`authMiddleware` (checks the JWT token) and `upload.single("resume")`
(handles the file upload).

---

### 5. backend/server.js (Modified)

Added the resume routes import and mount point.

---

## How Resume Parsing Works (End to End)

```
1. Recruiter uploads a PDF file through the frontend
   (POST /api/resumes/upload with form-data containing the file)

2. Multer middleware receives the file and saves it to /uploads

3. resumeController.uploadResume() is called with req.file set by Multer

4. parseResume(req.file.path) is called:
   a. extractText() reads the PDF and returns plain text
   b. extractName() finds the name from the first few lines
   c. extractEmail() finds email using regex
   d. extractPhone() finds phone number using regex
   e. extractSkills() matches text against the skills database
   f. extractEducation() finds degree keywords and years
   g. extractExperience() finds the experience section and parses entries

5. A new Candidate document is created with all the extracted data

6. The document is saved to MongoDB

7. The response is sent back with the candidate data
```

---

## Technologies Used

| Technology | Purpose |
|---|---|
| pdf-parse | Extract text from PDF files |
| mammoth | Extract text from DOCX files |
| Multer | Handle multipart file uploads |
| Regular Expressions | Pattern matching for email, phone, skills |
| fs (built-in) | Read files from disk |
| path (built-in) | Handle file paths across operating systems |

---

## How to Test with Postman

1. First, login to get a JWT token (POST /api/auth/login)
2. Create a new POST request to http://localhost:5000/api/resumes/upload
3. Set the Authorization header: `Bearer <your-token>`
4. In the Body tab, select "form-data"
5. Add a key named "resume" with type "File"
6. Select a PDF or DOCX resume file
7. Send the request
8. You should receive the parsed candidate data in the response

---

## Limitations and Notes

- The name extraction is heuristic-based and may not work for all resume
  formats. Some resumes start with contact info instead of the name.
- Education institution names are hard to extract reliably, so that field
  may be empty. The degree text usually contains enough information.
- The experience parser works best with chronologically formatted resumes.
- The skills database covers ~80 common tech skills. Additional skills
  can be added to the SKILLS_DATABASE array as needed.
