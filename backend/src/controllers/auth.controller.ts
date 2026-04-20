// ──────────────────────────────────────────────────────────────
// Auth Controller — Register / Login / Logout / Me
// ──────────────────────────────────────────────────────────────
// Controllers are intentionally thin: they receive pre-validated
// request bodies (enforced by the validate() middleware in the
// route layer), call the auth service, manage the httpOnly
// cookie, and return a consistent API shape.
//
// No schema definitions or safeParse calls belong here.
// ──────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../types';
import logger from '../utils/logger';

// ─── Cookie Config ───────────────────────────────────────────

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
};

// ─── Register ────────────────────────────────────────────────

export async function register(req: Request, res: Response) {
  try {
    const { user, token } = await authService.registerUser(req.body);

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user },
    });
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException;
    if (error.code === 'CONFLICT') {
      return res.status(409).json({ success: false, error: error.message });
    }
    logger.error('Register error', { err });
    return res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
}

// ─── Login ───────────────────────────────────────────────────

export async function login(req: Request, res: Response) {
  try {
    const { user, token } = await authService.loginUser(req.body);

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: { user },
    });
  } catch (err) {
    logger.warn('Login failed', { err });
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }
}

// ─── Logout ──────────────────────────────────────────────────

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token', { path: '/' });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}

// ─── Me (current session user) ───────────────────────────────

export async function me(req: AuthRequest, res: Response) {
  try {
    const user = await authService.getUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    logger.error('Me endpoint error', { err });
    return res.status(500).json({ success: false, error: 'Could not fetch user.' });
  }
}
