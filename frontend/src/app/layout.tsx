import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';
import { AuthProvider } from '@/context/AuthContext';
import { NavbarUser } from '@/components/NavbarUser';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumeAI — AI Resume Tailor + Job Matcher',
  description:
    'AI-powered resume tailoring and job matching. Score your resume against any job description, identify skill gaps, and generate tailored resumes and cover letters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gray-950 text-white min-h-screen antialiased`}
      >
        <AuthProvider>
          {/* ─── Background gradient ─────────────────────────── */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl" />
          </div>

          {/* ─── Navbar ──────────────────────────────────────── */}
          <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent hover:from-violet-300 hover:to-indigo-300 transition-all"
              >
                {APP_NAME}
              </Link>

              <div className="flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Auth section — client component */}
                <NavbarUser />
              </div>
            </div>
          </nav>

          {/* ─── Main Content ────────────────────────────────── */}
          <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>

          {/* ─── Footer ──────────────────────────────────────── */}
          <footer className="border-t border-white/5 mt-20">
            <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
              Built with Next.js, Express, Prisma &amp; OpenAI —{' '}
              <span className="text-gray-500">{APP_NAME}</span>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
