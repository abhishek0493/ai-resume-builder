# ResumeAI — Frontend Documentation

## Project Overview

**ResumeAI** is an AI-powered resume tailoring and job matching platform. The frontend is a Next.js application that provides a dark-themed, glassmorphic UI for:

1. Uploading a resume (paste-based text input)
2. Running an AI analysis against a job description
3. Viewing match score, skill gaps, and improvement recommendations
4. Generating a tailored cover letter or ATS-optimized resume rewrite
5. Browsing analysis history via a dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Font | Inter (Google Fonts via next/font) |
| HTTP Client | Native `fetch` with a centralized wrapper |
| Linting | ESLint 9 + eslint-config-next |

---

## Project Structure

```
frontend/
├── public/                    # Static assets (SVGs)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout — navbar, footer, background
│   │   ├── page.tsx           # Landing page (Next.js default placeholder)
│   │   ├── globals.css        # Global Tailwind base styles
│   │   ├── analyze/
│   │   │   └── page.tsx       # Resume upload + JD analysis flow
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Analysis history list
│   │   └── results/
│   │       └── [id]/
│   │           └── page.tsx   # Full analysis detail view
│   ├── components/
│   │   ├── HistoryCard.tsx    # Compact analysis summary card
│   │   ├── JDInput.tsx        # Job description form
│   │   ├── MatchScoreGauge.tsx# Circular SVG score visualisation
│   │   ├── ResumeUploader.tsx # Resume text input form
│   │   ├── SkillsGap.tsx      # Missing skills + recommendations display
│   │   └── ui/
│   │       ├── Badge.tsx      # Pill badge with variants
│   │       ├── Button.tsx     # Button with loading state
│   │       └── Card.tsx       # Card container with header subcomponents
│   ├── lib/
│   │   ├── constants.ts       # APP_NAME, NAV_LINKS, score labels
│   │   └── utils.ts           # cn(), formatDate(), score color helpers
│   ├── services/
│   │   └── api.ts             # Centralized HTTP API client
│   └── types/
│       └── index.ts           # TypeScript interfaces mirroring API shapes
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Pages

### `/` — Landing Page
Currently uses the default Next.js starter template. Serves as the entry point and will be built out into a proper landing/marketing page.

---

### `/analyze` — Analyze Page
**File:** `src/app/analyze/page.tsx`

A client component implementing a **3-step guided flow**:

**Step 1 — Upload Resume**
- Shows `ResumeUploader` component
- User pastes resume text (min 50 chars) and an optional file name
- On submit, calls `POST /api/resume/upload`
- On success, stores the returned `Resume` object in local state

**Step 2 — Add Job Description**
- Shows `JDInput` component after a resume is uploaded
- User pastes JD text (min 50 chars) with optional job title and company
- On submit, calls `POST /api/analyze`
- On success, stores the `AnalysisResult` in local state

**Step 3 — Results**
- Displays `MatchScoreGauge` (circular score visual)
- Displays an analysis summary card
- Displays `SkillsGap` (missing skills + recommendations)
- Provides buttons to generate a cover letter (`POST /api/generate/cover-letter`) or tailored resume (`POST /api/generate/resume`)
- Generated content appears inline below the action buttons

**State managed locally:**
- `resume` — the uploaded Resume record
- `analysis` — the AnalysisResult
- `isUploading`, `isAnalyzing`, `isGenerating` — loading states
- `generatedCoverLetter`, `generatedResume` — generated content strings
- `error` — error message for banner display

---

### `/dashboard` — Dashboard Page
**File:** `src/app/dashboard/page.tsx`

Fetches the user's full analysis history from `GET /api/history` on mount. Displays:

- A "New Analysis" button linking to `/analyze`
- A loading skeleton (3 pulsing placeholder cards)
- An empty state with a CTA if no history exists
- A list of `HistoryCard` components (one per `AnalysisResult`)

---

### `/results/[id]` — Result Detail Page
**File:** `src/app/results/[id]/page.tsx`

Fetches the full history list and finds the specific result by `id` from the URL params. Displays:

- Job title, company, and resume file name header
- `MatchScoreGauge` (large size)
- Analysis summary card
- `SkillsGap` component
- Generate content buttons that can regenerate if content already exists
- Previously generated cover letter and tailored resume (if present)

---

## Components

### `ResumeUploader`
**File:** `src/components/ResumeUploader.tsx`

A form card for pasting resume content. Fields:
- **Resume Name** (optional text input) — defaults to "My Resume"
- **Resume Content** (required textarea, min 50 chars)

Shows a live character count and a warning if below the minimum. Submit button is disabled until the minimum is met.

Props: `{ onUpload: (resumeText, fileName) => Promise<void>, isLoading?: boolean }`

---

### `JDInput`
**File:** `src/components/JDInput.tsx`

A form card for job description input. Fields:
- **Job Title** (optional)
- **Company** (optional)
- **Job Description** (required textarea, min 50 chars)

Props: `{ onSubmit: (jdText, jobTitle, company) => Promise<void>, isLoading?: boolean, disabled?: boolean }`

---

### `MatchScoreGauge`
**File:** `src/components/MatchScoreGauge.tsx`

An animated SVG circular progress ring showing the match score (0–100). Sizes: `sm` (100px), `md` (160px), `lg` (200px).

The ring color is dynamic:
- Score < 60: red gradient
- Score 60–79: violet-to-amber gradient
- Score ≥ 80: violet-to-emerald gradient

Below the ring, a pill badge shows a label (Excellent Match, Good Match, Fair Match, Needs Work).

Props: `{ score: number, size?: "sm" | "md" | "lg" }`

---

### `SkillsGap`
**File:** `src/components/SkillsGap.tsx`

Two-card component:
1. **Missing Skills** — renders each skill as a red `Badge`. Shows a positive message if no gaps are found.
2. **Recommendations** — numbered list of actionable improvement tips.

Props: `{ missingSkills: string[], recommendations: string[] }`

---

### `HistoryCard`
**File:** `src/components/HistoryCard.tsx`

A clickable card (wrapped in a `<Link>` to `/results/[id]`) showing:
- Job title and company
- Resume file name
- Match score (colored by score range)
- First 3 missing skills as red badges ("+N more" overflow badge)
- Analysis date
- Indicators for generated cover letter and tailored resume

Props: `{ analysis: AnalysisResult }`

---

### UI Primitives

#### `Button` (`src/components/ui/Button.tsx`)
Variants: `primary` (violet gradient), `secondary` (ghost), `danger` (red).
Sizes: `sm`, `md` (default), `lg`.
Supports an `isLoading` prop that shows a spinner and disables the button.

#### `Card` (`src/components/ui/Card.tsx`)
A styled container with `border-white/10` border and a subtle dark background.
Sub-components: `CardHeader`, `CardTitle`, `CardDescription`.
Supports `hover` prop for hover highlight effect.

#### `Badge` (`src/components/ui/Badge.tsx`)
Pill-shaped label. Variants: `default` (gray), `success` (emerald), `danger` (red), `warning` (amber), `info` (blue).

---

## API Client (`src/services/api.ts`)

All HTTP calls go through a single `apiRequest<T>()` wrapper that:
- Prepends the `BASE_URL` (`NEXT_PUBLIC_API_URL` env var, defaults to `http://localhost:5000/api`)
- Sets `Content-Type: application/json`
- Sends `credentials: "include"` for cookie-based auth
- Throws an `Error` with the API's `error` field if the response is not OK

**Exported functions:**

| Function | Method | Endpoint |
|---|---|---|
| `uploadResume(payload)` | POST | `/resume/upload` |
| `getResumes()` | GET | `/resume` |
| `analyzeResume(payload)` | POST | `/analyze` |
| `generateCoverLetter(payload)` | POST | `/generate/cover-letter` |
| `generateTailoredResume(payload)` | POST | `/generate/resume` |
| `getHistory()` | GET | `/history` |
| `healthCheck()` | GET | `/health` |

---

## TypeScript Types (`src/types/index.ts`)

All interfaces mirror the backend API response shapes. Key types:

```ts
interface Resume {
  id: string;
  fileName: string;
  resumeText: string;
  createdAt: string;
}

interface AnalysisResult {
  id: string;
  matchScore: number;
  missingSkills: string[];
  recommendations: string[];
  summary: string;
  createdAt: string;
  resume: Pick<Resume, "id" | "fileName">;
  jobDescription: Pick<JobDescription, "id" | "title" | "company">;
  generatedContent?: GeneratedContent | null;
}

interface GeneratedContent {
  id: string;
  generatedResume?: string | null;
  coverLetter?: string | null;
  createdAt: string;
}
```

---

## Styling & Design

- **Theme:** Dark mode only (`dark` class on `<html>`, `bg-gray-950` base)
- **Background:** Three fixed `blur-3xl` gradient orbs (violet, indigo, fuchsia) at various positions create depth
- **Typography:** Inter font from Google Fonts
- **Accent color:** Violet/Indigo gradient (`from-violet-600 to-indigo-600`)
- **Cards:** Semi-transparent dark backgrounds with `border-white/10` borders
- **Inputs:** `bg-white/5` backgrounds with `border-white/10`, focusing rings in violet

---

## Constants (`src/lib/constants.ts`)

```ts
APP_NAME = "ResumeAI"
APP_DESCRIPTION = "AI-powered resume tailoring and job matching platform"

NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analyze", href: "/analyze" },
]

// Score thresholds
getScoreLabel(score):
  >= 80 → "Excellent Match"
  >= 60 → "Good Match"
  >= 40 → "Fair Match"
  < 40  → "Needs Work"
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Scripts

| Script | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Start production | `npm start` |
| Lint | `npm run lint` |

---

## Navigation Flow

```
/ (Landing)
    │
    ├── /analyze          ← Step-by-step: upload → analyze → results + generate
    │
    └── /dashboard        ← History list
            │
            └── /results/[id]  ← Full detail view for any past analysis
```

---

## Current State & Known Gaps

- The root `/` page still shows the Next.js default starter template and has not been built out.
- There is no login/register UI — auth is JWT-based on the backend but no authentication pages exist yet. The API client sends cookies automatically when present.
- The `results/[id]` page fetches the full history list and finds the matching item client-side rather than calling a dedicated single-result endpoint (which does not exist on the backend yet).
