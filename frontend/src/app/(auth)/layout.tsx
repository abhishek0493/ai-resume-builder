// ──────────────────────────────────────────────────────────────
// Auth Layout — Centered full-screen layout for login/register
// ──────────────────────────────────────────────────────────────
// Auth pages use their own layout so they don't inherit the
// main app's navbar and footer.
// ──────────────────────────────────────────────────────────────

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4">
      {children}
    </div>
  );
}
