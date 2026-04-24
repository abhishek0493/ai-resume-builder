# AI Resume Builder & Job Matcher

An intelligent, full-stack application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and tailor them to specific job descriptions using AI.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT and HTTP-only cookies.
- **Resume Management**: Upload resumes and extract text seamlessly.
- **Job Description Analysis**: Input any job description to compare against your resume.
- **AI-Powered Match Scoring**: Get a detailed ATS compatibility score (0-100) powered by OpenAI's `gpt-4o`.
- **Actionable Insights**: Receive precise missing skills, recommendations, and a summary.
- **Tailored Content Generation**: Automatically generate highly customized cover letters and ATS-optimized resumes based on the analysis.
- **History Tracking**: Keep track of all past job matches and generated materials.

---

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS (v4)
- **Language**: TypeScript

### Backend

- **Framework**: Express.js (v5)
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **AI Integration**: OpenAI API (`gpt-4o`)
- **Security**: bcryptjs (hashing), JSON Web Tokens (JWT) for authentication

---

## 🏗 Architecture & Flow

### App Flow

1. **Authentication**: Users sign up or log in. A secure HTTP-only cookie holds the JWT session.
2. **Dashboard**: Users view past analysis results and upload new resumes.
3. **Upload Resume**: The resume text is extracted and securely stored in the database.
4. **Input Job Description**: The user provides the target job title, company, and JD text.
5. **Analysis Phase**:
   - The backend fetches the resume and JD.
   - It sends them to the OpenAI API with a strict system prompt to act as an ATS specialist.
   - The AI returns a structured JSON containing a `matchScore`, `missingSkills`, `recommendations`, and a `summary`.
   - The result is persisted in the database.
6. **Generation Phase (Optional)**:
   - Users can request a **Tailored Cover Letter** or a **Tailored Resume**.
   - The backend passes the previously generated analysis, original resume, and JD back to the AI.
   - The AI generates natural, tailored content focusing on strengths and addressing missing skills.
   - The generated content is saved and linked to the specific analysis result.

---

## 📡 API Endpoints

The backend exposes a structured RESTful API.

### Authentication (`/api/auth`)

- `POST /register` - Register a new user.
- `POST /login` - Authenticate a user and set JWT cookie.
- `POST /logout` - Clear the JWT session.
- `GET /me` - Get the currently authenticated user's details.

### Resume Management (`/api/resume`)

- `POST /upload` - Upload a resume file (multipart/form-data) and extract text.
- `GET /` - List all resumes uploaded by the user.

### Analysis (`/api/analyze`)

- `POST /` - Start a new analysis. Requires a `resumeId` and `jdText`. Creates a JD record and performs AI analysis.

### Generation (`/api/generate`)

- `POST /cover-letter` - Generate a cover letter for a specific `analysisResultId`.
- `POST /tailored-resume` - Generate an ATS-optimized resume for a specific `analysisResultId`.

### History (`/api/history`)

- `GET /` - Fetch all past analysis results, including associated resumes, job descriptions, and any generated content.

### Health Check (`/api/health`)

- `GET /health` - Unauthenticated endpoint to check if the API is running.

---

## 🤖 AI Flow Detail

All AI interactions are isolated in a dedicated `ai.service.ts` to ensure clean separation of concerns and easy model swapping in the future.

1. **Resume Analysis**
   - **Model**: `gpt-4o`
   - **Temperature**: `0.3` (Low temperature for factual, consistent ATS scoring)
   - **Output**: Enforced JSON format containing the match score, missing skills list, actionable recommendations, and a brief summary.

2. **Cover Letter Generation**
   - **Model**: `gpt-4o`
   - **Temperature**: `0.7` (Higher temperature for more creative, engaging writing)
   - **Context**: Given the original resume, JD, and the prior analysis, it writes a compelling letter addressing strengths and framing gaps positively.

3. **Tailored Resume Generation**
   - **Model**: `gpt-4o`
   - **Temperature**: `0.5` (Balanced temperature)
   - **Context**: Rewrites the resume to maximize ATS compatibility, naturally integrating JD keywords while strictly avoiding fabricating experience.

---

## 🗄 Database Schema (Prisma)

- **User**: The root entity for authentication.
- **Resume**: Stores extracted text from user uploads.
- **JobDescription**: Stores target job titles and full JD text.
- **AnalysisResult**: Joins a Resume and a JobDescription. Contains the AI's matching score, missing skills, and recommendations.
- **GeneratedContent**: 1:1 relationship with an AnalysisResult. Stores the optional AI-generated cover letters and tailored resumes.

---

## 🛠 Local Development

### Prerequisites

- Node.js (v20+)
- PostgreSQL Database
- OpenAI API Key

### Backend Setup

1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up your `.env` file (see `.env.example`). Needs `DATABASE_URL`, `JWT_SECRET`, and `OPENAI_API_KEY`.
4. Run Prisma migrations: `npx prisma db push`
5. Start the dev server: `npm run dev`

### Frontend Setup

1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Set up your `.env.local` file with the backend API URL.
4. Start the development server: `npm run dev`
