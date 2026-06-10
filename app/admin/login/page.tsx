"use client";

// app/admin/login/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin login form.
//
// Posts the entered password to /api/admin/login. The server validates against
// the ADMIN_PASSWORD env var and sets an httpOnly session cookie on success.
//
// SECURITY: no password is hardcoded in this file. The 1.5s delay on failed
// attempts is enforced server-side, so client-side bypasses don't work.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!password || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Server set the httpOnly cookie — navigate into the panel
        router.replace("/admin");
        // Hard refresh so the proxy re-runs with the new cookie attached
        router.refresh();
      } else {
        setError(data?.error || `Login failed (${res.status})`);
        setPassword("");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] flex items-center justify-center px-4 font-sans">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl font-black mb-2">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </div>
          <div className="text-gray-500 text-sm">Admin Panel — Authorised Access Only</div>
        </div>

        {/* Card */}
        <div className="bg-[#13131F] border border-white/5 rounded-3xl p-8">

          <h1 className="text-xl font-extrabold text-white mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your admin dashboard</p>

          {/* Password field */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-xs text-gray-500 font-medium">Admin Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                disabled={loading}
                autoFocus
                autoComplete="current-password"
                className="w-full px-5 py-4 pr-12 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 focus:shadow-[0_0_15px_rgba(108,58,255,0.1)] transition-all text-sm disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors text-sm"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold transition-all shadow-lg shadow-violet-900/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              "Sign In →"
            )}
          </button>
        </div>

        {/* Security note */}
        <div className="mt-6 text-center text-xs text-gray-700 space-y-1">
          <p>🔒 Server-side authentication · httpOnly session cookie</p>
          <p>All admin API endpoints require a valid session</p>
        </div>

        {/* Back to site */}
        <div className="mt-4 text-center">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to purstech.com
          </a>
        </div>
      </div>
    </div>
  );
}
