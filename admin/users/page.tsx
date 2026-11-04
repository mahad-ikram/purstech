"use client";

// app/admin/users/page.tsx — v2
// ─────────────────────────────────────────────────────────────────────────────
// Users & Subscribers — REAL DATA upgrade.
//
// WHAT CHANGED vs v1:
//  • Fake hardcoded subscriber emails REMOVED. Now fetches the real
//    newsletter_subscribers table via /api/admin/subscribers.
//  • Honest empty state when there are no subscribers yet (currently true).
//  • Mobile cards / desktop table.
//  • CSV export exports real data.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

type Subscriber = {
  id:            string;
  email:         string;
  is_active:     boolean;
  source:        string | null;
  subscribed_at: string;
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600)   return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminUsersPage() {
  const [subs,    setSubs]    = useState<Subscriber[]>([]);
  const [counts,  setCounts]  = useState({ total: 0, active: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [toast,   setToast]   = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers?limit=500");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.ok) {
        setSubs(json.subscribers);
        setCounts(json.counts);
        setError("");
      } else {
        setError(json.error || "Failed to load");
      }
    } catch (e) {
      setError(`Could not load subscribers: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    if (subs.length === 0) { showToast("Nothing to export yet"); return; }
    const csv = ["Email,Source,Subscribed,Active",
      ...subs.map(s => `${s.email},${s.source ?? ""},${s.subscribed_at},${s.is_active}`)
    ].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "purstech-subscribers.csv";
    a.click();
    showToast("✅ Exported!");
  };

  return (
    <div className="space-y-5 sm:space-y-6">

      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-6 left-4 sm:left-auto bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 text-center sm:text-left">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Users & Subscribers</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Live from Supabase <code className="bg-[#13131F] px-1 rounded text-[#6C3AFF]">newsletter_subscribers</code>
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="text-xs bg-[#13131F] border border-white/5 rounded-xl px-3 py-2 text-gray-400 hover:text-white transition-all disabled:opacity-50 self-start">
          {loading ? "⟳ Loading…" : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400">
          ⚠ {error}
        </div>
      )}

      {/* Stats — real numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label:"Total Subscribers", value:counts.total,  color:"text-violet-400" },
          { label:"Active",            value:counts.active, color:"text-green-400"  },
          { label:"New Today",         value:counts.today,  color:"text-yellow-400" },
          { label:"Pro Users",         value:0,             color:"text-cyan-400"   },
        ].map((s) => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-3.5 sm:p-4 text-center">
            <div className={`text-xl sm:text-2xl font-extrabold ${s.color}`}>{loading ? "—" : s.value}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subscribers */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Newsletter Subscribers</h2>
          <button onClick={exportCSV}
            className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] border border-[#6C3AFF]/30 px-3 py-1.5 rounded-lg font-bold transition-all">
            ⬇️ Export CSV
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-600 text-sm">Loading subscribers…</div>
        ) : subs.length === 0 ? (
          /* ── Honest empty state ── */
          <div className="py-12 px-6 text-center">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-base font-bold text-white mb-2">No subscribers yet</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              When visitors subscribe through the newsletter form, they&apos;ll appear here in real time.
              Once traffic grows after AdSense approval, this list will start filling up.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE: cards */}
            <div className="md:hidden divide-y divide-white/5">
              {subs.map((sub) => (
                <div key={sub.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm text-white font-mono break-all">{sub.email}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                      sub.is_active ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-gray-400/10 text-gray-500 border border-gray-400/20"
                    }`}>
                      {sub.is_active ? "Active" : "Unsubscribed"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {sub.source ?? "unknown"} · {timeAgo(sub.subscribed_at)}
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP: table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <div className="col-span-5">Email</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-3">Subscribed</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              {subs.map((sub) => (
                <div key={sub.id} className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
                  <div className="col-span-5 text-sm text-white font-mono truncate">{sub.email}</div>
                  <div className="col-span-2 text-xs text-gray-500 capitalize">{sub.source ?? "—"}</div>
                  <div className="col-span-3 text-xs text-gray-500">{timeAgo(sub.subscribed_at)}</div>
                  <div className="col-span-2 flex justify-end">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      sub.is_active ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-gray-400/10 text-gray-500 border border-gray-400/20"
                    }`}>
                      {sub.is_active ? "Active" : "Unsubscribed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pro users placeholder — honest */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 sm:p-8 text-center">
        <div className="text-4xl mb-3">💳</div>
        <h3 className="text-lg font-bold text-white mb-2">No Pro Users Yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          PursTech Pro launches in a later phase with Stripe payments. Subscriber plans,
          billing status and usage stats will appear here once it&apos;s live.
        </p>
        <a href="https://stripe.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold text-sm transition-all">
          Set Up Stripe →
        </a>
      </div>

    </div>
  );
}
