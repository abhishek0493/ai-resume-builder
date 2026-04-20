'use client';

// ──────────────────────────────────────────────────────────────
// NavbarUser — Auth-aware section of the navigation bar
// ──────────────────────────────────────────────────────────────
// This must be a client component because it reads useAuth().
// If loading: render nothing (avoids layout shift).
// If authenticated: shows user email + logout button.
// If unauthenticated: shows Login link.
// ──────────────────────────────────────────────────────────────

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function NavbarUser() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return <div className="w-20 h-7 rounded-lg bg-white/5 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {/* User pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 max-w-[160px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">{user.name || user.email}</span>
        </div>

        {/* Logout */}
        <button
          id="logout-button"
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
          aria-label="Log out"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      id="login-nav-link"
      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 shadow-sm transition-all"
    >
      Sign in
    </Link>
  );
}
