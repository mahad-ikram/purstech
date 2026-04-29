"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentStatus = "idle" | "running" | "error" | "scheduled" | "paused";

interface AgentLog {
  id:        string;
  agent:     string;
  action:    string;
  result:    string;
  status:    "success" | "error" | "info";
  timestamp: string;
}

interface Agent {
  id:          string;
  name:        string;
  fullName:    string;
  icon:        string;
  color:       string;
  description: string;
  schedule:    string;
  status:      AgentStatus;
  lastRun:     string;
  nextRun:     string;
  todayCount:  number;
  totalCount:  number;
  dailyLimit:  number;
  enabled:     boolean;
}

interface ToolIdea {
  id:         string;
  name:       string;
  category:   string;
  source:     string;
  trendScore: number;
  status:     "pending" | "building" | "built" | "rejected";
  createdAt:  string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_AGENTS: Agent[] = [
  {
    id: "scout", name: "Scout", fullName: "Scout — Research Agent",
    icon: "🔍", color: "#6C3AFF",
    description: "Scans Google Trends, Reddit (r/webdev, r/productivity) and Product Hunt every 6 hours for trending tool ideas. Saves ideas to the queue for Forge to build.",
    schedule: "Every 6 hours", status: "idle", lastRun: "2 hours ago",
    nextRun: "In 4 hours", todayCount: 3, totalCount: 47, dailyLimit: 4, enabled: true,
  },
  {
    id: "forge", name: "Forge", fullName: "Forge — Builder Agent",
    icon: "🔨", color: "#00D4FF",
    description: "Takes ideas from Scout's queue and builds complete React tool components using Claude AI. Validates code, fixes errors, creates files and updates the database automatically.",
    schedule: "Every 12 hours", status: "idle", lastRun: "8 hours ago",
    nextRun: "In 4 hours", todayCount: 2, totalCount: 18, dailyLimit: 5, enabled: true,
  },
  {
    id: "quill", name: "Quill", fullName: "Quill — SEO Writer Agent",
    icon: "✍️", color: "#00E676",
    description: "Writes SEO blog posts, tool descriptions, meta tags, How-To sections and FAQ content. Publishes 2-3 new blog posts daily and updates old content to stay fresh.",
    schedule: "Daily 3:00 AM", status: "idle", lastRun: "3 hours ago",
    nextRun: "Tomorrow 3:00 AM", todayCount: 2, totalCount: 34, dailyLimit: 5, enabled: true,
  },
  {
    id: "weave", name: "Weave", fullName: "Weave — Internal Linking Agent",
    icon: "🔗", color: "#FFD700",
    description: "Updates related tools sections across all pages, rebuilds the sitemap.xml and ensures every new tool is linked from at least 3 other pages. Keeps SEO link structure healthy.",
    schedule: "Daily 4:00 AM", status: "idle", lastRun: "1 hour ago",
    nextRun: "Tomorrow 4:00 AM", todayCount: 1, totalCount: 29, dailyLimit: 2, enabled: true,
  },
  {
    id: "shadow", name: "Shadow", fullName: "Shadow — Competitor Agent",
    icon: "🕵️", color: "#FF3A6C",
    description: "Weekly analysis of SmallSEOTools, Toolsaday, 10015.io and other competitors. Extracts their tool lists, finds gaps PursTech doesn't cover and reports unique market opportunities.",
    schedule: "Every Sunday", status: "scheduled", lastRun: "5 days ago",
    nextRun: "Sunday 2:00 AM", todayCount: 0, totalCount: 4, dailyLimit: 1, enabled: true,
  },
  {
    id: "pulse", name: "Pulse", fullName: "Pulse — Analytics Agent",
    icon: "📈", color: "#FF9800",
    description: "Reads traffic data, identifies which tools get the most use, flags underperforming pages for improvement and sends a weekly performance report to your email.",
    schedule: "Daily 6:00 AM", status: "idle", lastRun: "6 hours ago",
    nextRun: "Tomorrow 6:00 AM", todayCount: 1, totalCount: 22, dailyLimit: 2, enabled: true,
  },
  {
    id: "mint", name: "Mint", fullName: "Mint — Revenue Agent",
    icon: "💰", color: "#00E676",
    description: "Optimises AdSense ad placement based on highest CTR positions, rotates affiliate link placements contextually and monitors API usage for billing optimisation.",
    schedule: "Daily 5:00 AM", status: "paused", lastRun: "2 days ago",
    nextRun: "Paused", todayCount: 0, totalCount: 12, dailyLimit: 2, enabled: false,
  },
];

const INITIAL_LOGS: AgentLog[] = [
  { id:"1", agent:"Weave",  action:"Updated internal links",            result:"47 pages updated, sitemap rebuilt",           status:"success", timestamp:"1 hour ago"   },
  { id:"2", agent:"Quill",  action:"Published blog post",               result:"'Best Free JSON Tools 2025' — 1,240 words",   status:"success", timestamp:"3 hours ago"  },
  { id:"3", agent:"Quill",  action:"Published blog post",               result:"'How to Compress Images for Free' — 980 words",status:"success", timestamp:"3 hours ago"  },
  { id:"4", agent:"Scout",  action:"Found trending tool ideas",         result:"14 new ideas saved to queue",                 status:"success", timestamp:"2 hours ago"  },
  { id:"5", agent:"Forge",  action:"Built new tool",                    result:"'Markdown Table Generator' deployed",         status:"success", timestamp:"8 hours ago"  },
  { id:"6", agent:"Forge",  action:"Built new tool",                    result:"'URL Encoder/Decoder' deployed",              status:"success", timestamp:"8 hours ago"  },
  { id:"7", agent:"Pulse",  action:"Analytics report generated",        result:"Top tool: Image Compressor (+12% this week)", status:"success", timestamp:"6 hours ago"  },
  { id:"8", agent:"Scout",  action:"Reddit scan",                       result:"r/webdev: 'base64 tool' trending — added to queue", status:"info", timestamp:"4 hours ago"},
  { id:"9", agent:"Forge",  action:"Code validation failed",            result:"CSS Gradient Generator — syntax error, retrying", status:"error", timestamp:"10 hours ago"},
  { id:"10",agent:"Forge",  action:"Retry successful",                  result:"CSS Gradient Generator — fixed and deployed", status:"success", timestamp:"9 hours ago"  },
];

const INITIAL_IDEAS: ToolIdea[] = [
  { id:"1", name:"CSS Gradient Generator",  category:"dev",     source:"Reddit",        trendScore:92, status:"built",    createdAt:"Today"     },
  { id:"2", name:"Markdown Table Generator",category:"text",    source:"Google Trends", trendScore:87, status:"built",    createdAt:"Today"     },
  { id:"3", name:"URL Encoder/Decoder",     category:"dev",     source:"Product Hunt",  trendScore:85, status:"built",    createdAt:"Today"     },
  { id:"4", name:"SVG Optimizer",           category:"image",   source:"Reddit",        trendScore:78, status:"pending",  createdAt:"Today"     },
  { id:"5", name:"JSON to CSV Converter",   category:"dev",     source:"Google Trends", trendScore:74, status:"pending",  createdAt:"Today"     },
  { id:"6", name:"Cron Expression Generator",category:"dev",    source:"Reddit",        trendScore:71, status:"pending",  createdAt:"Yesterday" },
  { id:"7", name:"Color Gradient Generator",category:"image",   source:"Product Hunt",  trendScore:68, status:"pending",  createdAt:"Yesterday" },
  { id:"8", name:"Text to Slug Converter",  category:"text",    source:"Shadow Agent",  trendScore:65, status:"rejected", createdAt:"2 days ago"},
];

// ─── Status helpers ───────────────────────────────────────────────────────────

const AGENT_STATUS: Record<AgentStatus, { dot: string; label: string; text: string }> = {
  idle:      { dot: "bg-gray-500",                  label: "Idle",      text: "text-gray-400"   },
  running:   { dot: "bg-green-500 animate-pulse",   label: "Running",   text: "text-green-400"  },
  error:     { dot: "bg-red-500 animate-pulse",     label: "Error",     text: "text-red-400"    },
  scheduled: { dot: "bg-yellow-500",                label: "Scheduled", text: "text-yellow-400" },
  paused:    { dot: "bg-orange-500",                label: "Paused",    text: "text-orange-400" },
};

const LOG_COLORS = {
  success: { dot: "bg-green-500",  text: "text-green-400",  bg: "bg-green-500/5"  },
  error:   { dot: "bg-red-500",    text: "text-red-400",    bg: "bg-red-500/5"    },
  info:    { dot: "bg-cyan-500",   text: "text-cyan-400",   bg: "bg-cyan-500/5"   },
};

const IDEA_STATUS: Record<string, { color: string; bg: string }> = {
  pending:  { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  building: { color: "text-cyan-400",   bg: "bg-cyan-400/10 border-cyan-400/20"     },
  built:    { color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20"   },
  rejected: { color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20"       },
};

// ─── Agent Card ───────────────────────────────────────────────────────────────

function AgentCard({
  agent, onRun, onToggle, onLimitChange,
}: {
  agent: Agent;
  onRun: (id: string) => void;
  onToggle: (id: string) => void;
  onLimitChange: (id: string, v: number) => void;
}) {
  const sc = AGENT_STATUS[agent.status];

  return (
    <div className={`bg-[#13131F] border rounded-2xl p-5 transition-all ${
      agent.enabled ? "border-white/5 hover:border-white/10" : "border-white/[0.03] opacity-60"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${agent.color}15` }}>
            {agent.icon}
          </div>
          <div>
            <div className="font-extrabold text-white text-sm">{agent.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
              <span className={`text-xs font-semibold ${sc.text}`}>{sc.label}</span>
            </div>
          </div>
        </div>

        {/* Enable toggle */}
        <button onClick={() => onToggle(agent.id)}
          className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${agent.enabled ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${agent.enabled ? "left-6" : "left-1"}`} />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
        {agent.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Today",    value: agent.todayCount  },
          { label: "Total",    value: agent.totalCount  },
          { label: "Limit/day",value: agent.dailyLimit  },
        ].map((s) => (
          <div key={s.label} className="bg-[#0A0A14] rounded-xl p-2.5 text-center">
            <div className="text-base font-extrabold text-white">{s.value}</div>
            <div className="text-[10px] text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Schedule info */}
      <div className="text-xs text-gray-600 mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Schedule:</span>
          <span className="text-gray-400">{agent.schedule}</span>
        </div>
        <div className="flex justify-between">
          <span>Last run:</span>
          <span className="text-gray-400">{agent.lastRun}</span>
        </div>
        <div className="flex justify-between">
          <span>Next run:</span>
          <span className={agent.status === "paused" ? "text-orange-400" : "text-gray-400"}>{agent.nextRun}</span>
        </div>
      </div>

      {/* Daily limit slider */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Daily run limit</span>
          <span className="text-white font-bold">{agent.dailyLimit}</span>
        </div>
        <input type="range" min={1} max={10} value={agent.dailyLimit}
          onChange={(e) => onLimitChange(agent.id, Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${agent.color} ${(agent.dailyLimit/10)*100}%, #1a1a2e ${(agent.dailyLimit/10)*100}%)` }}
        />
      </div>

      {/* Run button */}
      <button
        onClick={() => onRun(agent.id)}
        disabled={!agent.enabled || agent.status === "running"}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
          agent.status === "running"
            ? "bg-green-500/20 text-green-400 cursor-wait"
            : agent.enabled
            ? "bg-[#6C3AFF]/20 hover:bg-[#6C3AFF] text-[#6C3AFF] hover:text-white border border-[#6C3AFF]/30"
            : "bg-white/5 text-gray-600 cursor-not-allowed"
        }`}
      >
        {agent.status === "running" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
            Running...
          </span>
        ) : `▶ Run ${agent.name} Now`}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminAgentsPage() {
  const [agents,      setAgents]      = useState<Agent[]>(INITIAL_AGENTS);
  const [logs,        setLogs]        = useState<AgentLog[]>(INITIAL_LOGS);
  const [ideas,       setIdeas]       = useState<ToolIdea[]>(INITIAL_IDEAS);
  const [activeTab,   setActiveTab]   = useState<"agents"|"queue"|"logs">("agents");
  const [toast,       setToast]       = useState("");
  const [masterOn,    setMasterOn]    = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ── Run agent ─────────────────────────────────────────────────────────────
  const handleRun = (id: string) => {
    setAgents((prev) => prev.map((a) => a.id === id ? { ...a, status: "running" } : a));

    // Simulate agent running for 3 seconds
    setTimeout(() => {
      setAgents((prev) => prev.map((a) =>
        a.id === id ? { ...a, status: "idle", lastRun: "Just now", todayCount: a.todayCount + 1, totalCount: a.totalCount + 1 } : a
      ));

      const agent = agents.find((a) => a.id === id);
      if (agent) {
        const newLog: AgentLog = {
          id:        String(Date.now()),
          agent:     agent.name,
          action:    `Manual run triggered`,
          result:    `${agent.name} completed successfully`,
          status:    "success",
          timestamp: "Just now",
        };
        setLogs((prev) => [newLog, ...prev]);
        showToast(`${agent.icon} ${agent.name} completed ✅`);
      }
    }, 3000);

    showToast(`${agents.find(a => a.id === id)?.icon} ${agents.find(a => a.id === id)?.name} is running...`);
  };

  // ── Toggle agent ──────────────────────────────────────────────────────────
  const handleToggle = (id: string) => {
    setAgents((prev) => prev.map((a) =>
      a.id === id
        ? { ...a, enabled: !a.enabled, status: a.enabled ? "paused" : "idle" }
        : a
    ));
    const agent = agents.find((a) => a.id === id);
    showToast(agent?.enabled ? `${agent.icon} ${agent.name} paused` : `${agent?.icon} ${agent?.name} enabled ✅`);
  };

  // ── Master switch ─────────────────────────────────────────────────────────
  const handleMasterToggle = () => {
    const newVal = !masterOn;
    setMasterOn(newVal);
    setAgents((prev) => prev.map((a) => ({
      ...a, enabled: newVal, status: newVal ? "idle" : "paused",
    })));
    showToast(newVal ? "✅ All agents enabled" : "⏸️ All agents paused");
  };

  // ── Limit change ──────────────────────────────────────────────────────────
  const handleLimitChange = (id: string, val: number) => {
    setAgents((prev) => prev.map((a) => a.id === id ? { ...a, dailyLimit: val } : a));
  };

  // ── Idea actions ──────────────────────────────────────────────────────────
  const approveIdea = (id: string) => {
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, status: "building" } : i));
    showToast("🔨 Forge will build this tool next run");
  };
  const rejectIdea = (id: string) => {
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, status: "rejected" } : i));
    showToast("❌ Idea rejected");
  };

  // ── Summary stats ─────────────────────────────────────────────────────────
  const runningCount  = agents.filter((a) => a.status === "running").length;
  const enabledCount  = agents.filter((a) => a.enabled).length;
  const todayTotal    = agents.reduce((s, a) => s + a.todayCount, 0);
  const pendingIdeas  = ideas.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50">
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">AI Agents Control Room</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Monitor, control and run your 7 autonomous AI employees.
          </p>
        </div>

        {/* Master switch */}
        <div className="flex items-center gap-3 bg-[#13131F] border border-white/5 rounded-2xl px-5 py-3 self-start">
          <div>
            <div className="text-sm font-bold text-white">Master Switch</div>
            <div className="text-xs text-gray-500">{masterOn ? "All agents active" : "All agents paused"}</div>
          </div>
          <button onClick={handleMasterToggle}
            className={`w-12 h-6 rounded-full transition-all relative ml-2 ${masterOn ? "bg-green-500" : "bg-gray-700"}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${masterOn ? "left-7" : "left-1"}`} />
          </button>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Running Now",    value: runningCount,  color: "text-green-400",  icon: "▶" },
          { label: "Active Agents",  value: `${enabledCount}/7`, color: "text-violet-400", icon: "🤖" },
          { label: "Actions Today",  value: todayTotal,    color: "text-cyan-400",   icon: "⚡" },
          { label: "Ideas in Queue", value: pendingIdeas,  color: "text-yellow-400", icon: "💡" },
        ].map((s) => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-lg mb-0.5">{s.icon}</div>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 bg-[#13131F] border border-white/5 rounded-2xl p-1.5 w-fit">
        {[
          { id: "agents", label: "🤖 Agents",    count: 7           },
          { id: "queue",  label: "💡 Ideas Queue",count: pendingIdeas},
          { id: "logs",   label: "📋 Activity Log",count: logs.length},
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#6C3AFF] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id ? "bg-white/20" : "bg-white/5"
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── AGENTS TAB ── */}
      {activeTab === "agents" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onRun={handleRun}
              onToggle={handleToggle}
              onLimitChange={handleLimitChange}
            />
          ))}
        </div>
      )}

      {/* ── IDEAS QUEUE TAB ── */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Scout found these tool ideas. Approve to send to Forge, or reject to skip.
            </p>
            <button
              onClick={() => {
                ideas.filter(i => i.status === "pending").forEach(i => approveIdea(i.id));
              }}
              className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF] text-[#6C3AFF] hover:text-white border border-[#6C3AFF]/30 px-4 py-2 rounded-xl font-bold transition-all"
            >
              ✅ Approve All Pending
            </button>
          </div>

          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <div className="col-span-4">Tool Idea</div>
              <div className="col-span-2 hidden md:block">Category</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2 hidden sm:block">Trend Score</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {ideas.map((idea) => {
              const sc = IDEA_STATUS[idea.status];
              return (
                <div key={idea.id}
                  className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">

                  <div className="col-span-4">
                    <div className="font-semibold text-white text-sm">{idea.name}</div>
                    <div className="text-xs text-gray-600">{idea.createdAt}</div>
                  </div>

                  <div className="col-span-2 hidden md:block">
                    <span className="text-xs text-gray-500 capitalize bg-[#0A0A14] px-2.5 py-1 rounded-lg">
                      {idea.category}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-xs text-gray-400">{idea.source}</span>
                  </div>

                  <div className="col-span-2 hidden sm:block">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#0A0A14] rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] h-1.5 rounded-full"
                          style={{ width: `${idea.trendScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-mono w-6">{idea.trendScore}</span>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    {idea.status === "pending" ? (
                      <>
                        <button onClick={() => approveIdea(idea.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-bold transition-all">
                          ✓ Build
                        </button>
                        <button onClick={() => rejectIdea(idea.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all">
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${sc.color} ${sc.bg}`}>
                        {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LOGS TAB ── */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Real-time log of everything your AI agents have done.
            </p>
            <button onClick={() => setLogs([])}
              className="text-xs text-gray-600 hover:text-red-400 transition-colors">
              Clear logs
            </button>
          </div>

          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
            {logs.length === 0 ? (
              <div className="py-12 text-center text-gray-600">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-sm">No activity yet</div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {logs.map((log) => {
                  const lc = LOG_COLORS[log.status];
                  return (
                    <div key={log.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors ${lc.bg}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${lc.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-white">{log.agent}</span>
                          <span className="text-xs text-gray-500">—</span>
                          <span className="text-xs text-gray-400">{log.action}</span>
                        </div>
                        <div className={`text-xs mt-0.5 ${lc.text}`}>{log.result}</div>
                      </div>
                      <div className="text-xs text-gray-600 flex-shrink-0">{log.timestamp}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* ── API cost monitor ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">💳 AI API Cost Monitor</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Today",       value: "$0.43",   color: "text-green-400"  },
            { label: "This Month",  value: "$3.87",   color: "text-cyan-400"   },
            { label: "Monthly Budget",value: "$30.00",color: "text-gray-400"   },
            { label: "Remaining",   value: "$26.13",  color: "text-violet-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0A0A14] rounded-xl p-3 text-center">
              <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Monthly budget usage</span>
            <span className="text-white font-bold">13%</span>
          </div>
          <div className="bg-[#0A0A14] rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-cyan-400 h-2 rounded-full" style={{ width: "13%" }} />
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Budget alert set at $30/month. You will receive an email if spending exceeds this limit.
          <Link href="/admin/settings" className="text-[#6C3AFF] hover:text-[#00D4FF] ml-1 transition-colors">
            Change in Settings →
          </Link>
        </p>
      </div>

    </div>
  );
}
