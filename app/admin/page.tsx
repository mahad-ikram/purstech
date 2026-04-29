"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Fake live stats (replace with real Supabase queries later) ───────────────

function useLiveStats() {
  const [stats, setStats] = useState({
    visitorsToday:   12847,
    toolsUsedToday:  48293,
    revenueToday:    47.20,
    newToolsToday:   3,
    totalTools:      5,
    proUsers:        0,
    newsletterSubs:  0,
    totalBlogPosts:  0,
  });

  // Simulate live visitor counter ticking up
  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) => ({
        ...s,
        visitorsToday:  s.visitorsToday  + Math.floor(Math.random() * 3),
        toolsUsedToday: s.toolsUsedToday + Math.floor(Math.random() * 5),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return stats;
}

// ─── Traffic sparkline (fake 30-day data) ────────────────────────────────────

const TRAFFIC_DATA = [
  820, 932, 701, 1134, 1290, 1330, 1320, 900, 1100, 1200,
  1400, 1350, 1250, 1450, 1600, 1580, 1700, 1650, 1800, 1750,
  1900, 2100, 1950, 2200, 2300, 2150, 2400, 2350, 2500, 2847,
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 300, h = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
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
      {/* Fill */}
      <polygon
        points={`0,${h} ${pts} ${w},${h}`}
        fill="url(#sparkGrad)"
      />
      {/* Line */}
      <polyline
        points={pts}
        fill="none"
        stroke="#6C3AFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1] - min) / (max - min)) * h}
        r="3"
        fill="#6C3AFF"
      />
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, color, trend,
}: {
  icon: string; label: string; value: string | number;
  sub?: string; color: string; trend?: string;
}) {
  return (
    <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#0A0A14] flex items-center justify-center text-xl">
          {icon}
        </div>
        {trend && (
          <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
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

// ─── Activity Feed ────────────────────────────────────────────────────────────

const ACTIVITY = [
  { time: "2 min ago",  icon: "✅", text: "Word Counter",     action: "visited",  color: "text-green-400"  },
  { time: "5 min ago",  icon: "🔧", text: "JSON Formatter",   action: "used",     color: "text-cyan-400"   },
  { time: "8 min ago",  icon: "👤", text: "New subscriber",   action: "email",    color: "text-violet-400" },
  { time: "12 min ago", icon: "🔐", text: "Password Gen",     action: "used",     color: "text-green-400"  },
  { time: "18 min ago", icon: "🎨", text: "Color Picker",     action: "used",     color: "text-pink-400"   },
  { time: "24 min ago", icon: "🔗", text: "QR Code Generator",action: "used",     color: "text-yellow-400" },
  { time: "31 min ago", icon: "📊", text: "Homepage",         action: "visited",  color: "text-blue-400"   },
];

// ─── Top Tools ────────────────────────────────────────────────────────────────

const TOP_TOOLS = [
  { name: "Image Compressor",  uses: 2100000, pct: 100, icon: "🖼️" },
  { name: "Word Counter",      uses: 1800000, pct: 86,  icon: "📝" },
  { name: "JSON Formatter",    uses: 1500000, pct: 71,  icon: "💻" },
  { name: "Password Generator",uses: 980000,  pct: 47,  icon: "🔐" },
  { name: "PDF Compressor",    uses: 870000,  pct: 41,  icon: "📄" },
];

// ─── Agent Status ─────────────────────────────────────────────────────────────

const AGENTS = [
  { name: "Scout",  icon: "🔍", status: "idle",     last: "6 hours ago",    found: "14 ideas"  },
  { name: "Forge",  icon: "🔨", status: "idle",     last: "12 hours ago",   built: "3 tools"   },
  { name: "Quill",  icon: "✍️", status: "idle",     last: "3 hours ago",    wrote: "2 posts"   },
  { name: "Weave",  icon: "🔗", status: "idle",     last: "1 hour ago",     updated: "47 links"},
  { name: "Shadow", icon: "🕵️", status: "scheduled",last: "Sunday 2am",     found: "23 gaps"   },
  { name: "Pulse",  icon: "📈", status: "idle",     last: "6 hours ago",    flagged: "2 pages" },
  { name: "Mint",   icon: "💰", status: "idle",     last: "2 hours ago",    optimised: "12 ads"},
];

const STATUS_COLORS: Record<string, string> = {
  running:   "bg-green-500 animate-pulse",
  idle:      "bg-gray-600",
  error:     "bg-red-500 animate-pulse",
  scheduled: "bg-yellow-500",
};

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { icon: "🔧", label: "Add New Tool",    href: "/admin/tools"    },
  { icon: "📝", label: "Write Blog Post", href: "/admin/blog"     },
  { icon: "🤖", label: "Run AI Agents",  href: "/admin/agents"   },
  { icon: "⚙️", label: "Site Settings",  href: "/admin/settings" },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const stats = useLiveStats();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back. Here&apos;s what&apos;s happening on PursTech right now.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#13131F] border border-white/5 rounded-xl px-4 py-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400 font-mono">{currentTime}</span>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:-translate-y-0.5 group"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Live stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👥" label="Visitors Today"    value={stats.visitorsToday}  color="text-[#6C3AFF]" trend="+12%" sub="vs yesterday" />
        <StatCard icon="⚡" label="Tools Used Today"  value={stats.toolsUsedToday} color="text-[#00D4FF]" trend="+8%"  sub="across all tools" />
        <StatCard icon="💰" label="Revenue Today"     value={`$${stats.revenueToday.toFixed(2)}`} color="text-green-400" trend="+5%" sub="AdSense + Pro" />
        <StatCard icon="🔧" label="Live Tools"        value={stats.totalTools}     color="text-yellow-400" sub="more coming soon" />
      </div>

      {/* ── Traffic chart + activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Traffic sparkline */}
        <div className="lg:col-span-2 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Traffic — Last 30 Days</h2>
              <p className="text-xs text-gray-500 mt-0.5">Daily unique visitors</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold text-[#6C3AFF]">
                {stats.visitorsToday.toLocaleString()}
              </div>
              <div className="text-xs text-green-400 font-semibold">↑ 12% vs yesterday</div>
            </div>
          </div>
          <Sparkline data={TRAFFIC_DATA} />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Live activity */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-sm font-bold text-white">Live Activity</h2>
          </div>
          <div className="space-y-3">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${item.color}`}>
                    {item.text}
                  </div>
                  <div className="text-xs text-gray-600">{item.action}</div>
                </div>
                <div className="text-xs text-gray-700 flex-shrink-0">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top tools + agent status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top tools */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">🏆 Top Tools by Usage</h2>
            <Link href="/admin/tools" className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {TOP_TOOLS.map((tool, i) => (
              <div key={tool.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{tool.icon}</span>
                    <span className="text-sm text-white font-medium">{tool.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {(tool.uses / 1000000).toFixed(1)}M uses
                  </span>
                </div>
                <div className="bg-[#0A0A14] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${tool.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents status */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">🤖 AI Agents Status</h2>
            <Link href="/admin/agents" className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
              Control →
            </Link>
          </div>
          <div className="space-y-3">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3 py-1">
                <span className="text-base w-6 text-center">{agent.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{agent.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_COLORS[agent.status]}`} />
                    <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
                  </div>
                  <div className="text-xs text-gray-600">Last run: {agent.last}</div>
                </div>
                <button className="text-xs bg-[#0A0A14] hover:bg-[#6C3AFF]/20 text-gray-500 hover:text-[#6C3AFF] px-3 py-1 rounded-lg transition-all font-bold">
                  Run
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Secondary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-violet-400">{stats.proUsers}</div>
          <div className="text-xs text-gray-500 mt-1">Pro Users</div>
          <div className="text-xs text-gray-700 mt-0.5">$0 MRR</div>
        </div>
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-cyan-400">{stats.newsletterSubs}</div>
          <div className="text-xs text-gray-500 mt-1">Subscribers</div>
          <div className="text-xs text-gray-700 mt-0.5">Newsletter</div>
        </div>
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-green-400">{stats.totalBlogPosts}</div>
          <div className="text-xs text-gray-500 mt-1">Blog Posts</div>
          <div className="text-xs text-gray-700 mt-0.5">Published</div>
        </div>
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-extrabold text-yellow-400">190+</div>
          <div className="text-xs text-gray-500 mt-1">Countries</div>
          <div className="text-xs text-gray-700 mt-0.5">Worldwide reach</div>
        </div>
      </div>

      {/* ── Alert banner ── */}
      <div className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-2xl">💡</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-0.5">Next Step: Apply for Google AdSense</div>
          <div className="text-xs text-gray-500">
            You have {stats.totalTools} live tools — once you reach 20+ tools, apply at adsense.google.com to start earning from every visitor.
          </div>
        </div>
        <a
          href="https://adsense.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all"
        >
          Apply Now →
        </a>
      </div>

    </div>
  );
}
