# 🤖 Claude AI Agent Instructions

Welcome to the ResumeAI Frontend project! This document contains everything you need to know to work effectively as an AI agent on this codebase.

## 📋 Project Overview

**ResumeAI** is an AI-powered resume tailoring and job matching platform. The frontend is a Next.js application that provides a dark-themed, glassmorphic UI for:

1. Uploading a resume (paste-based text input)
2. Running an AI analysis against a job description
3. Viewing match score, skill gaps, and improvement recommendations
4. Generating a tailored cover letter or ATS-optimized resume rewrite

**Key Features:**

- 🎨 Dark mode with glassmorphism design system
- ⚡️ Fast, responsive UI with Next.js 16
- 🔒 JWT-based authentication (stubbed for now)
- 📊 Real-time analysis feedback
- 📝 Cover letter and resume rewrite generation
- 💾 History of past analyses

## 🛠️ Tech Stack

| Category             | Technology   | Version | Purpose                                |
| -------------------- | ------------ | ------- | -------------------------------------- |
| **Framework**        | Next.js      | 16.0.3  | React framework with server components |
| **Runtime**          | Node.js      | 24.x    | JavaScript runtime                     |
| **Language**         | TypeScript   | 5.x     | Type-safe JavaScript                   |
| **Styling**          | Tailwind CSS | 4.1.17  | Utility-first CSS framework            |
| **UI Primitives**    | shadcn/ui    | v1.0.0  | Reusable UI components                 |
| **State Management** | React Hooks  | 19.2.0  | Component state management             |
| **HTTP Client**      | axios        | 1.10.1  | API requests                           |
| **Validation**       | zod          | 3.24.1  | Schema validation                      |

## 📂 Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── (auth)/               # Authentication pages (not implemented yet)
│   │   ├── login/login.tsx
│   │   └── register/register.tsx
│   ├── analyze/              # AI analysis flow
│   │   ├── page.tsx          # Main analysis page
│   │   └── results/[id]/page.tsx  # Analysis results
│   ├── dashboard/            # User dashboard
│   │   └── page.tsx
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Landing page (default)
├── components/               # Reusable React components
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── label.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/               # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   ├── analyze/              # Analysis-specific components
│   │   ├── ResumeUpload.tsx
│   │   ├── JobDescriptionInput.tsx
│   │   ├── AnalysisResults.tsx
│   │   ├── SkillGapAnalysis.tsx
│   │   ├── ImprovementSuggestions.tsx
│   │   └── CoverLetterGenerator.tsx
│   ├── dashboard/            # Dashboard components
│   │   ├── AnalysisHistory.tsx
│   │   └── AnalysisCard.tsx
│   └── common/               # General utility components
│       ├── ThemeProvider.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── lib/                      # Business logic and utilities
│   ├── api.ts                # API client (axios)
│   ├── auth.ts               # Authentication helpers (stubbed)
│   ├── utils.ts              # General utilities
│   ├── types.ts              # TypeScript interfaces
│   └── constants.ts          # API endpoints and constants
├── styles/                   # Global styles
│   ├── globals.css           # Tailwind directives
│   └── theme.css             # Custom theme variables
├── public/                   # Static assets
└── documentation/            # Project documentation
    └── PROJECT_OVERVIEW.md   # This file
```

## 🎨 Design System

### Theme

- **Mode**: Dark mode by default
- **Background**: Deep charcoal (#0a0a0a)
- **Card**: Dark gray with subtle border (#171717)
- **Accent Color**: Cyan (#06b6d4) - used for primary actions and highlights
- **Text**: Off-white (#fafafa) for readability

### Glassmorphism

- **Blur**: backdrop-blur-md
- **Opacity**: bg-white/5
- **Border**: border-white/10
- **Shadow**: shadow-lg

### Components

- **Buttons**: Primary (cyan), Secondary (gray), Ghost (transparent)
- **Cards**: Hover effects with scale and shadow
- **Inputs**: Focus states with cyan glow
- **Badges**: Color-coded by category (green for good, yellow for warning, red for critical)

## 🧩 Key Pages

### 1. `/analyze` - AI Analysis Flow

**Step 1: Upload Resume**

- Paste resume text into textarea
- Real-time character count
- Validation: Minimum 100 characters required

**Step 2: Enter Job Description**

- Paste job description
- Validation: Minimum 50 characters required

**Step 3: View Results**

- Match score (0-100%)
- Skill gap analysis
- Improvement recommendations
- Cover letter generation button
- Resume rewrite button

### 2. `/dashboard` - User Dashboard

- List of past analyses
- Each analysis shows:
  - Date and time
  - Match score
  - Job title (if available)
  - Link to detailed results

### 3. `/results/[id]` - Detailed Results

- Full analysis breakdown
- Side-by-side comparison (optional)
- Download buttons for generated content

## 🔌 API Integration

All API calls are handled by `lib/api.ts`. The base URL is set via `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api`).

### Key Endpoints

1. **Analyze Resume**

   ```typescript
   POST / api / analyze;
   ```

   **Request:**

   ```typescript
   {
     resumeText: string;
     jobDescription: string;
   }
   ```

   **Response:**

   ```typescript
   {
     id: string;
     matchScore: number;
     skillGaps: string[];
     recommendations: string[];
     coverLetter?: string;
     rewrittenResume?: string;
   }
   ```

2. **Get Analysis History**

   ```typescript
   GET / api / analyze / history;
   ```

   **Response:**

   ```typescript
   {
     analyses: Array<{
       id: string;
       matchScore: number;
       createdAt: string;
     }>;
   }
   ```

3. **Get Single Analysis**
   ```typescript
   GET /api/analyze/:id
   ```
   **Response:**
   ```typescript
   {
     analysis: {
       id: string;
       matchScore: number;
       skillGaps: string[];
       recommendations: string[];
       coverLetter?: string;
       rewrittenResume?: string;
       createdAt: string;
     };
   }
   ```

## 🔐 Authentication

Authentication is stubbed for now. The following files exist but are not fully implemented:

- `app/(auth)/login/login.tsx`
- `app/(auth)/register/register.tsx`
- `lib/auth.ts`

**Current State:**

- No login/register UI
- No token storage
- No protected routes

**Future Implementation:**

- JWT-based authentication
- HTTP-only cookies for token storage
- Protected routes using middleware
- Login/register pages with form validation

##
