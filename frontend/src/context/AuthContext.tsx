'use client';

// ──────────────────────────────────────────────────────────────
// Auth Context — Global Session Management
// ──────────────────────────────────────────────────────────────
// Provides:
//   • user        — current User | null
//   • isLoading   — true while the initial /me check is in-flight
//   • login()     — POST /auth/login, sets cookie, updates state
//   • register()  — POST /auth/register, sets cookie, updates state
//   • logout()    — POST /auth/logout, clears cookie, resets state
//
// Every page wraps with <AuthProvider> (in layout.tsx).
// Components consume with the useAuth() hook.
// ──────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import * as api from '@/services/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from cookie on mount
  useEffect(() => {
    api.authMe()
      .then((res) => {
        if (res.data?.user) setUser(res.data.user);
      })
      .catch(() => {
        // No valid session — that's fine, user is logged out
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.authLogin({ email, password });
    if (res.data?.user) setUser(res.data.user);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await api.authRegister({ email, password, name });
    if (res.data?.user) setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    await api.authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
