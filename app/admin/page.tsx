"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatsData {
  totalUses:   number;
  todayUses:   number;
  weekUses:    number;
  monthUses:   number;
  topTools:    { tool_slug: string; tool_category: string; total_uses: number }[];
  categories:  { tool_category: string; total_uses: number }[];
  recent:      { id: string; tool_slug: string; tool_category: string; created_at: string }[];
  dailyTrend:  { day: string; use_count: number }[];
  fetchedAt:   string;
}

// ─── Tool icon + colour maps ──────────────────────────────────────────────────

const TOOL_ICONS: Record<string, string> = {
  "word-counter":"📝","case-converter":"🔤","lorem-ipsum":"📄","diff-checker":"🔍",
  "text-to-speech":"🔊","json-formatter":"💻","base64-encoder":"🔐","url-encoder":"🔗",
  "uuid-generator":"🎲","qr-code-generator":"🔲","hash-generator":"🔑",
  "css-minifier":"🎨","html-minifier":"🗜","regex-tester":"🧪","js-minifier":"⚡",
  "html-to-markdown":"📝","markdown-editor":"✍️","color-code-converter":"🖌",
  "svg-editor":"✦","color-picker":"🎨","image-compressor":"🗜","image-resizer":"📐",
  "background-remover":"✂️","favicon-generator":"🏷","image-to-text":"📷",
  "meta-tag-generator":"🏷","robots-txt-generator":"🤖","keyword-density-checker":"🔢",
  "open-graph-generator":"📊","sitemap-generator":"🗺","age-calculator":"🎂",
  "bmi-calculator":"⚖️","percentage-calculator":"🔢","unit-converter":"📏",
  "currency-converter":"💱","loan-calculator":"🏦","compound-interest-calculator":"📈",
  "tip-calculator":"🍽","time-zone-converter":"🕐","mortgage-calculator":"🏠",
  "password-generator":"🔐","ssl-checker":"🔒","ip-lookup":"🌐",
  "pdf-compressor":"🗜","pdf-merger":"📑","pdf-splitter":"✂️",
  "pdf-to-word":"📝","word-to-pdf":"📄","grammar-checker":"✓","readability-checker":"📊",
};

const CAT_ICONS: Record<string, string> = {
  text:"📝", dev:"💻", image:"🖼️", seo:"🔍", ai:"🤖",
  finance:"💰", security:"🔒", pdf:"📄", unknown:"🔧",
};

const CAT_COLORS: Record<string, string> = {
  text:"text-violet-400", dev:"text-cyan-400", image:"text-yellow-400",
  seo:"text-green-400", ai:"text-pink-400", finance:"text-emerald-400",
  security:"text-red-400", pdf:"text-orange-400", unknown:"text-gray-400",
};

const toTitle = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n/1e6).toFixed(1)}M`
  : n >= 1_000   ? `${(n/1e3).toFixed(1)}K`
  : String(n);

const relTime = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return new Date(iso).toLocaleDateString();
};

// ─── Sparkline ── kept identical to original ──────────────────────────────────

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const w = 300, h = 60;
  const pts = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C3AFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6C3AFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#sparkGrad)" />
      <polyline points={pts} fill="none" stroke="#6C3AFF" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length-1] - min) / (max - min || 1)) * h}
        r="3" fill="#6C3AFF" />
    </svg>
  );
}

// ─── StatCard ── kept identical to original ───────────────────────────────────

function StatCard({ icon, label, value, sub, color, trend }: {
  icon: string; label: string; value: string | number;
  sub?: string; color: string; trend?: string;
}) {
  return (
    <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#0A0A14] flex items-center justify-center text-xl">{icon}</div>
        {trend && (
          <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full">{trend}</span>
        )}
      </div>
      <div className={`text-2xl font-extrabold mb-1 ${color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-gray-400 text-sm font-medium">{label}</div>
      {sub && <div className="text-gray-600 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`bg-[#1a1a2e] rounded-xl animate-pulse ${className}`} />
);

// ─── AI Agents ── unchanged, Phase 6 ─────────────────────────────────────────

const AGENTS = [
  { name:"Scout",  icon:"🔍", status:"idle",      last:"Not yet deployed" },
  { name:"Forge",  icon:"🔨", status:"idle",      last:"Not yet deployed" },
  { name:"Quill",  icon:"✍️",  status:"idle",      last:"Not yet deployed" },
  { name:"Weave",  icon:"🔗", status:"idle",      last:"Not yet deployed" },
  { name:"Shadow", icon:"🕵️", status:"scheduled", last:"Not yet deployed" },
  { name:"Pulse",  icon:"📈", status:"idle",      last:"Not yet deployed" },
  { name:"Mint",   icon:"💰", status:"idle",      last:"Not yet deployed" },
];

const STATUS_COLORS: Record<string, string> = {
  running:"bg-green-500 animate-pulse", idle:"bg-gray-600",
  error:"bg-red-500 animate-pulse",     scheduled:"bg-yellow-500",
};

// ─── Quick Actions ── unchanged ───────────────────────────────────────────────

const QUICK_ACTIONS = [
  { icon:"🔧", label:"Add New Tool",    href:"/admin/tools"    },
  { icon:"📝", label:"Write Blog Post", href:"/admin/blog"     },
  { icon:"🤖", label:"Run AI Agents",  href:"/admin/agents"   },
  { icon:"⚙️", label:"Site Settings",  href:"/admin/settings" },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [data,    setData]    = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [time,    setTime]    = useState("");

  // Live clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  // Fetch real Supabase stats via API route
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError("");
    } catch (e) {
      setError(`Failed to load stats: ${String(e)}`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 60_000);
    return () => clearInterval(id);
  }, [fetchStats]);

  // Build 7-day sparkline (fill missing days with 0)
  const sparkline = (() => {
    const out: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      out.push(Number(data?.dailyTrend?.find(x => x.day === key)?.use_count ?? 0));
    }
    return out;
  })();

  const topMax = Number(data?.topTools?.[0]?.total_uses ?? 1);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {data?.fetchedAt
              ? `Live from Supabase · updated ${relTime(data.fetchedAt)}`
              : "Connecting to Supabase…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchStats} disabled={loading}
            className="text-xs bg-[#13131F] border border-white/5 rounded-xl px-3 py-2 text-gray-400 hover:text-white transition-all disabled:opacity-50">
            {loading ? "⟳ Loading…" : "↻ Refresh"}
          </button>
          <div className="flex items-center gap-2 bg-[#13131F] border border-white/5 rounded-xl px-4 py-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-mono">{time}</span>
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm">
          <div className="text-red-400 font-bold mb-1">⚠ {error}</div>
          <div className="text-xs text-gray-600">
            Make sure you ran <code className="bg-[#0A0A14] px-1 rounded">supabase-setup.sql</code> and
            added <code className="bg-[#0A0A14] px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to Vercel env vars.
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(a => (
          <Link key={a.href} href={a.href}
            className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:-translate-y-0.5 group">
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Stat cards — REAL DATA ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({length:4}).map((_,i) => <Skel key={i} className="h-32" />)
          : <>
              <StatCard icon="⚡" label="Tools Used Today"  color="text-[#6C3AFF]"
                value={fmt(data?.todayUses ?? 0)} sub="since midnight UTC" />
              <StatCard icon="📅" label="This Week"          color="text-[#00D4FF]"
                value={fmt(data?.weekUses  ?? 0)} sub="last 7 days" />
              <StatCard icon="📆" label="This Month"         color="text-green-400"
                value={fmt(data?.monthUses ?? 0)} sub="calendar month" />
              <StatCard icon="♾️"  label="All-Time Uses"     color="text-yellow-400"
                value={fmt(data?.totalUses ?? 0)} sub="across all 50 tools" />
            </>
        }
      </div>

      {/* ── Sparkline + Live Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Sparkline — REAL 7-day trend */}
        <div className="lg:col-span-2 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Tool Uses — Last 7 Days</h2>
              <p className="text-xs text-gray-500 mt-0.5">Real data from Supabase</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold text-[#6C3AFF]">
                {loading ? "—" : fmt(data?.weekUses ?? 0)}
              </div>
              <div className="text-xs text-green-400 font-semibold">7-day total</div>
            </div>
          </div>
          {loading
            ? <Skel className="h-16 w-full" />
            : <Sparkline data={sparkline} />
          }
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>7 days ago</span><span>Today</span>
          </div>
        </div>

        {/* Live Activity — REAL DATA */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-sm font-bold text-white">Live Activity</h2>
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({length:7}).map((_,i) => <Skel key={i} className="h-8" />)}</div>
          ) : data?.recent && data.recent.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.recent.slice(0,7).map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-base flex-shrink-0">{CAT_ICONS[item.tool_category] ?? "🔧"}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold truncate ${CAT_COLORS[item.tool_category] ?? "text-gray-400"}`}>
                      {toTitle(item.tool_slug)}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">{item.tool_category}</div>
                  </div>
                  <div className="text-xs text-gray-700 flex-shrink-0">{relTime(item.created_at)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-700 text-sm py-8">
              No activity yet.<br/>
              <code className="text-xs bg-[#0A0A14] px-1 rounded">useTrackTool()</code> not added to tools.
            </div>
          )}
        </div>
      </div>

      {/* ── Top Tools + Agents ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top Tools — REAL DATA */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">🏆 Top Tools by Usage</h2>
            <Link href="/admin/tools" className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-4">{Array.from({length:5}).map((_,i) => <Skel key={i} className="h-8" />)}</div>
          ) : data?.topTools && data.topTools.length > 0 ? (
            <div className="space-y-4">
              {data.topTools.slice(0,5).map(tool => {
                const pct = Math.round((Number(tool.total_uses) / topMax) * 100);
                return (
                  <div key={tool.tool_slug}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{TOOL_ICONS[tool.tool_slug] ?? "🔧"}</span>
                        <Link href={`/tools/${tool.tool_slug}`}
                          className="text-sm text-white font-medium hover:text-[#6C3AFF] transition-colors">
                          {toTitle(tool.tool_slug)}
                        </Link>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{fmt(Number(tool.total_uses))} uses</span>
                    </div>
                    <div className="bg-[#0A0A14] rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] h-2 rounded-full transition-all duration-700"
                        style={{ width:`${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-700 text-sm py-8">
              No data yet — add <code className="text-xs bg-[#0A0A14] px-1 rounded">useTrackTool()</code> to your tools.
            </div>
          )}
        </div>

        {/* AI Agents — unchanged (Phase 6) */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">🤖 AI Agents Status</h2>
            <Link href="/admin/agents" className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">Control →</Link>
          </div>
          <div className="space-y-3">
            {AGENTS.map(agent => (
              <div key={agent.name} className="flex items-center gap-3 py-1">
                <span className="text-base w-6 text-center">{agent.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{agent.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_COLORS[agent.status]}`} />
                    <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
                  </div>
                  <div className="text-xs text-gray-600">{agent.last}</div>
                </div>
                <button disabled className="text-xs bg-[#0A0A14] text-gray-700 px-3 py-1 rounded-lg cursor-not-allowed">
                  Phase 6
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Secondary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-violet-400">0</div>
          <div className="text-xs text-gray-500 mt-1">Pro Users</div>
          <div className="text-xs text-gray-700 mt-0.5">$0 MRR · Phase 4</div>
        </div>
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-cyan-400">50</div>
          <div className="text-xs text-gray-500 mt-1">Live Tools</div>
          <div className="text-xs text-gray-700 mt-0.5">8 categories</div>
        </div>
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-green-400">10</div>
          <div className="text-xs text-gray-500 mt-1">Blog Posts</div>
          <div className="text-xs text-gray-700 mt-0.5">Published</div>
        </div>
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          {loading
            ? <Skel className="h-8 w-16 mx-auto mb-1" />
            : <div className="text-2xl font-extrabold text-yellow-400">{data?.categories?.length ?? 0}</div>
          }
          <div className="text-xs text-gray-500 mt-1">Active Categories</div>
          <div className="text-xs text-gray-700 mt-0.5">with tracked uses</div>
        </div>
      </div>

      {/* ── Alert: AdSense already applied ── */}
      <div className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-2xl">✅</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-0.5">Phase 3A Complete — Admin Connected to Supabase</div>
          <div className="text-xs text-gray-500">
            Real tool usage tracking is live. Add <code className="bg-[#0A0A14] px-1 rounded">useTrackTool(slug, category)</code> to
            each tool&apos;s <code className="bg-[#0A0A14] px-1 rounded">client.tsx</code>.
            AdSense already applied — awaiting approval.
            <strong className="text-gray-400"> Next: Phase 3B — Auth system.</strong>
          </div>
        </div>
        <Link href="/tools"
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">
          View Site →
        </Link>
      </div>

    </div>
  );
}
