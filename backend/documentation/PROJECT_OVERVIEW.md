# ResumeAI — Backend Documentation

## Project Overview

**ResumeAI** is an AI-powered resume tailoring and job matching platform. The backend provides a REST API that enables users to:

1. Upload resume text for storage
2. Analyze a resume against a job description using OpenAI GPT-4o
3. Generate a tailored cover letter or rewritten resume optimized for ATS
4. Retrieve a history of past analyses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Language | TypeScript |
| Database | PostgreSQL (via Prisma ORM 5.9.1) |
| AI Provider | OpenAI GPT-4o |
| Auth | JWT (httpOnly cookie or Bearer token) |
| Validation | Zod v4 |
| Logging | Winston |
| Dev server | ts-node-dev |

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── server.ts              # Express app entry point
│   ├── controllers/
│   │   ├── analyze.controller.ts
│   │   ├── generate.controller.ts
│   │   ├── history.controller.ts
│   │   └── resume.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   ├── error.middleware.ts    # Global error handler
│   │   └── validate.middleware.ts # Zod request validation
│   ├── routes/
│   │   ├── index.ts               # Route aggregator
│   │   ├── analyze.routes.ts
│   │   ├── generate.routes.ts
│   │   ├── history.routes.ts
│   │   └── resume.routes.ts
│   ├── services/
│   │   ├── ai.service.ts          # All OpenAI API calls
│   │   ├── analysis.service.ts    # Analysis + generation orchestration
│   │   └── resume.service.ts      # Resume CRUD
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces
│   └── utils/
│       ├── logger.ts              # Winston logger instance
│       ├── openai.ts              # OpenAI client singleton
│       └── prisma.ts              # Prisma client singleton
├── package.json
└── tsconfig.json
```

---

## Database Schema

The database uses PostgreSQL managed via Prisma. All models use UUID primary keys.

### Models

#### `User`
Stores registered users. Root entity for all data.

| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| email | String | Unique |
| password | String | bcrypt hash |
| name | String? | Optional display name |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Relations: `resumes[]`, `jobDescriptions[]`, `analysisResults[]`

---

#### `Resume`
Stores the plain text content of an uploaded resume.

| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| userId | String | FK → User |
| fileName | String? | Original file label |
| resumeText | Text | Full extracted resume text |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Relations: `analysisResults[]`

---

#### `JobDescription`
Stores raw job description text with optional metadata.

| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| userId | String | FK → User |
| title | String? | Job title (metadata) |
| company | String? | Company name (metadata) |
| jdText | Text | Full JD text |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Relations: `analysisResults[]`

---

#### `AnalysisResult`
The core entity — links a Resume and JobDescription with AI analysis output.

| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| userId | String | FK → User |
| resumeId | String | FK → Resume |
| jobDescriptionId | String | FK → JobDescription |
| matchScore | Float | 0–100 ATS compatibility score |
| missingSkills | Json | `string[]` of missing skills |
| recommendations | Json? | `string[]` of improvement tips |
| summary | Text? | AI-generated narrative summary |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Relations: `generatedContent?` (optional 1:1)

---

#### `GeneratedContent`
Optional AI-generated content tied 1:1 to an AnalysisResult.

| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| analysisResultId | String | FK → AnalysisResult (unique) |
| generatedResume | Text? | ATS-optimized resume rewrite |
| coverLetter | Text? | AI-written cover letter |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

---

## API Endpoints

All routes are prefixed with `/api`. Protected routes require a valid JWT.

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | None | Returns API status and timestamp |

**Response:**
```json
{
  "success": true,
  "message": "AI Resume Tailor API is running",
  "timestamp": "2026-04-12T00:00:00.000Z"
}
```

---

### Resume

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/resume/upload` | Required | Save resume text to database |
| GET | `/api/resume` | Required | List all resumes for the user |

#### POST `/api/resume/upload`

**Request Body:**
```json
{
  "resumeText": "Full resume text... (min 50 chars)",
  "fileName": "Software Engineer Resume"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "fileName": "...", "resumeText": "...", "createdAt": "..." },
  "message": "Resume uploaded successfully"
}
```

---

### Analyze

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/analyze` | Required | Run AI analysis on a resume vs job description |

#### POST `/api/analyze`

**Request Body:**
```json
{
  "resumeId": "uuid",
  "jdText": "Full job description... (min 50 chars)",
  "jobTitle": "Senior Frontend Engineer",
  "company": "Google"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "matchScore": 72.5,
    "missingSkills": ["GraphQL", "Docker"],
    "recommendations": ["Add GraphQL experience...", "..."],
    "summary": "Your resume is a strong match for...",
    "resume": { "id": "...", "fileName": "..." },
    "jobDescription": { "id": "...", "title": "...", "company": "..." }
  },
  "message": "Analysis complete"
}
```

The analysis flow:
1. Fetches the resume from DB (ownership-checked)
2. Creates a `JobDescription` record
3. Calls OpenAI GPT-4o with structured JSON output
4. Persists `AnalysisResult` to DB
5. Returns the result with related entities

---

### Generate

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/generate/cover-letter` | Required | Generate a cover letter from an analysis |
| POST | `/api/generate/resume` | Required | Generate an ATS-optimized resume rewrite |

Both endpoints require a prior `analysisResultId`.

**Request Body:**
```json
{
  "analysisResultId": "uuid"
}
```

**Response (cover letter):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "coverLetter": "Dear Hiring Manager...",
    "generatedResume": null,
    "createdAt": "..."
  },
  "message": "Cover letter generated successfully"
}
```

Generated content is upserted — re-running the endpoint overwrites the previous result.

---

### History

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/history` | Required | List all analysis results for the user |

Returns analyses ordered newest-first, with related resume, JD, and generated content included.

---

## Middleware

### `authMiddleware`
Reads the JWT from either:
- An httpOnly cookie named `token` (browser clients)
- The `Authorization: Bearer <token>` header (API / mobile clients)

On success, attaches `req.user = { userId, email }` for downstream use.

### `validate(schema)`
A generic Zod validation middleware factory. Pass a Zod schema and it validates `req.body` before the controller runs. Returns a `400` with field-level error details on failure.

### `errorMiddleware`
Global error handler registered last. Reads `err.statusCode` (defaulting to 500). In production mode, returns a generic message to avoid leaking internals; in development, returns the full stack trace.

---

## AI Service (`ai.service.ts`)

The only file that communicates directly with the OpenAI API. Provides three functions:

### `analyzeResumeAgainstJD(resumeText, jdText)`
- Model: `gpt-4o`
- Temperature: `0.3` (factual, consistent scoring)
- Response format: `json_object`
- Returns: `{ matchScore, missingSkills, recommendations, summary }`

### `generateCoverLetter(resumeText, jdText, matchAnalysis)`
- Model: `gpt-4o`
- Temperature: `0.7` (more creative writing)
- Returns: plain text cover letter (max ~400 words)

### `generateTailoredResume(resumeText, jdText, matchAnalysis)`
- Model: `gpt-4o`
- Temperature: `0.5`
- Rewrites existing content for ATS compatibility — does not fabricate experience
- Returns: plain text resume (max 2 pages of content)

---

## Authentication

Authentication is **stubbed** at the middleware level — the `authMiddleware` verifies and decodes a JWT, but there are currently no `/register` or `/login` endpoints implemented. These would need to be added to complete the auth flow.

**Environment variables required:**
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": [
    { "field": "resumeText", "message": "Required" }
  ]
}
```

`details` is only present on validation errors (400 responses).

---

## Scripts

| Script | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Start production | `npm start` |
| Generate Prisma client | `npm run prisma:generate` |
| Push schema to DB | `npm run prisma:push` |
| Prisma Studio (DB UI) | `npm run prisma:studio` |
| Type check | `npm run typecheck` |
