import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

// ──────────────────────────────────────────────────────────────
// Landing Page — Hero + feature highlights
// ──────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* ─── Hero Section ────────────────────────────────── */}
      <section className="text-center max-w-3xl mx-auto pt-16 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
          Powered by OpenAI
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
          Tailor your resume with{' '}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            AI precision
          </span>
        </h1>

        <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
          {APP_NAME} analyses your resume against any job description, scores
          your match, identifies skill gaps, and generates tailored resumes and
          cover letters — all in seconds.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-200"
          >
            Start Analyzing
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white/10 text-white font-medium border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* ─── Feature Grid ────────────────────────────────── */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center hover:border-violet-500/30 hover:bg-white/[0.08] transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">{feature.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* ─── How It Works ────────────────────────────────── */}
      <section className="w-full pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          How it{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            works
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-10 h-10 rounded-full bg-violet-600/30 text-violet-400 flex items-center justify-center font-bold text-sm mx-auto mb-4 border border-violet-500/30">
                {idx + 1}
              </div>
              <h4 className="text-white font-medium mb-2">{step.title}</h4>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: '🎯',
    title: 'ATS Match Scoring',
    description:
      'Get a precise 0–100 score showing how well your resume matches the job description against real ATS criteria.',
  },
  {
    icon: '🔍',
    title: 'Skill Gap Analysis',
    description:
      'Instantly identify missing skills and get actionable recommendations to bridge the gap.',
  },
  {
    icon: '✍️',
    title: 'AI Content Generation',
    description:
      'Generate tailored resumes and compelling cover letters optimised for the specific role.',
  },
];

const steps = [
  {
    title: 'Upload Resume',
    description: 'Paste your current resume text into the platform',
  },
  {
    title: 'Add Job Description',
    description: 'Paste the JD you want to apply for',
  },
  {
    title: 'AI Analysis',
    description: 'Get instant scoring, gaps, and recommendations',
  },
  {
    title: 'Generate Content',
    description: 'Create a tailored resume and cover letter',
  },
];
