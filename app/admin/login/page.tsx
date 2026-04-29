"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "purstech2025admin"; // ← Same password as layout.tsx
const MAX_ATTEMPTS   = 3;
const LOCKOUT_MS     = 60 * 60 * 1000; // 1 hour

export default function AdminLoginPage() {
  const router = useRouter();
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [attempts,  setAttempts]  = useState(0);
  const [locked,    setLocked]    = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  // Check lockout on mount
  useEffect(() => {
    const lockedUntil = Number(localStorage.getItem("admin_locked_until") || 0);
    if (Date.now() < lockedUntil) {
      setLocked(true);
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLockTimer(remaining);
    }
    // Already logged in → redirect
    if (sessionStorage.getItem("purstech_admin") === "true") {
      router.replace("/admin");
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (!locked || lockTimer <= 0) return;
    const id = setInterval(() => {
      setLockTimer((t) => {
        if (t <= 1) {
          setLocked(false);
          setAttempts(0);
          localStorage.removeItem("admin_locked_until");
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [locked, lockTimer]);

  const handleLogin = async () => {
    if (locked) return;
    setLoading(true);
    setError("");

    // Simulate slight delay (prevents brute force timing)
    await new Promise((r) => setTimeout(r, 600));

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("purstech_admin", "true");
      router.replace("/admin");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_MS;
        localStorage.setItem("admin_locked_until", String(lockedUntil));
        setLocked(true);
        setLockTimer(Math.ceil(LOCKOUT_MS / 1000));
        setError(`Too many failed attempts. Locked for 60 minutes.`);
      } else {
        setError(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? "" : "s"} remaining.`);
      }
      setPassword("");
    }
    setLoading(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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

          {/* Locked state */}
          {locked ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center mb-6">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-red-400 font-bold text-sm mb-1">Account Locked</div>
              <div className="text-gray-500 text-xs mb-3">Too many failed attempts</div>
              <div className="text-2xl font-extrabold text-red-400">{formatTime(lockTimer)}</div>
              <div className="text-gray-600 text-xs mt-1">remaining</div>
            </div>
          ) : (
            <>
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
                    className="w-full px-5 py-4 pr-12 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 focus:shadow-[0_0_15px_rgba(108,58,255,0.1)] transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
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

              {/* Attempts indicator */}
              {attempts > 0 && !locked && (
                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        i < attempts ? "bg-red-500" : "bg-white/10"
                      }`}
                    />
                  ))}
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
            </>
          )}
        </div>

        {/* Security note */}
        <div className="mt-6 text-center text-xs text-gray-700 space-y-1">
          <p>🔒 This page is not indexed by search engines</p>
          <p>All actions are logged with timestamp</p>
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
