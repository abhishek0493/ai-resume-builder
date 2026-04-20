'use client';

// ──────────────────────────────────────────────────────────────
// Protected Route — Client-side Route Guard
// ──────────────────────────────────────────────────────────────
// Wrap any page that requires auth. While session is loading,
// shows a centered spinner. If no user, redirects to /login.
// ──────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // While checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect handled in useEffect above
  if (!user) return null;

  return <>{children}</>;
}
