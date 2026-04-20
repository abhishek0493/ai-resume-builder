// ──────────────────────────────────────────────────────────────
// Auth Service — Registration, Login, Session Lookup
// ──────────────────────────────────────────────────────────────
// Keeps controllers thin by centralising:
//   • Password hashing + comparison (bcrypt)
//   • JWT signing
//   • Prisma user queries
// ──────────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from '../types';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = '7d';

// ─── Safe User Shape (never expose password) ────────────────

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

function toSafeUser(user: { id: string; email: string; name: string | null; createdAt: Date }): SafeUser {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

// ─── Register ────────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export async function registerUser(input: RegisterInput): Promise<{ user: SafeUser; token: string }> {
  const { email, password, name } = input;

  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('An account with this email already exists.');
    (err as NodeJS.ErrnoException).code = 'CONFLICT';
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name: name ?? null },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN });

  return { user: toSafeUser(user), token };
}

// ─── Login ───────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(input: LoginInput): Promise<{ user: SafeUser; token: string }> {
  const { email, password } = input;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid email or password.');
  }

  const payload: JwtPayload = { userId: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN });

  return { user: toSafeUser(user), token };
}

// ─── Get Current User ────────────────────────────────────────

export async function getUserById(userId: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toSafeUser(user) : null;
}
