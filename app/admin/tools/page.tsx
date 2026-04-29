"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToolStatus = "live" | "coming_soon" | "pending" | "disabled";

interface Tool {
  id:          string;
  name:        string;
  slug:        string;
  category:    string;
  icon:        string;
  description: string;
  status:      ToolStatus;
  uses:        number;
  badge:       string;
  builtBy:     "team" | "ai-forge";
  createdAt:   string;
  featured:    boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_TOOLS: Tool[] = [
  { id:"1", name:"Word Counter",        slug:"word-counter",        category:"text",     icon:"📝", description:"Count words, characters, sentences and paragraphs instantly.", status:"live",        uses:1800000, badge:"⭐ Top",  builtBy:"team",     createdAt:"2025-01-01", featured:true  },
  { id:"2", name:"JSON Formatter",      slug:"json-formatter",      category:"dev",      icon:"💻", description:"Format, validate and minify JSON data instantly.",             status:"live",        uses:1500000, badge:"⭐ Top",  builtBy:"team",     createdAt:"2025-01-02", featured:true  },
  { id:"3", name:"Password Generator",  slug:"password-generator",  category:"security", icon:"🔐", description:"Generate strong, cryptographically secure passwords.",         status:"live",        uses:980000,  badge:"🆕 New",  builtBy:"team",     createdAt:"2025-01-03", featured:true  },
  { id:"4", name:"QR Code Generator",   slug:"qr-code-generator",   category:"dev",      icon:"🔲", description:"Generate QR codes for URLs, WiFi, contacts and more.",         status:"live",        uses:650000,  badge:"🆕 New",  builtBy:"team",     createdAt:"2025-01-04", featured:true  },
  { id:"5", name:"Color Picker",        slug:"color-picker",        category:"image",    icon:"🎨", description:"Pick colors and get HEX, RGB, HSL, CMYK codes instantly.",     status:"live",        uses:490000,  badge:"",        builtBy:"team",     createdAt:"2025-01-05", featured:false },
  { id:"6", name:"Image Compressor",    slug:"image-compressor",    category:"image",    icon:"🖼️", description:"Compress JPG, PNG and WebP images without losing quality.",     status:"coming_soon", uses:0,       badge:"🔥 Hot",  builtBy:"team",     createdAt:"2025-01-06", featured:false },
  { id:"7", name:"Grammar Checker",     slug:"grammar-checker",     category:"text",     icon:"✍️", description:"Check and fix grammar errors using AI.",                      status:"coming_soon", uses:0,       badge:"🤖 AI",   builtBy:"ai-forge", createdAt:"2025-01-07", featured:false },
  { id:"8", name:"Meta Tag Generator",  slug:"meta-tag-generator",  category:"seo",      icon:"📊", description:"Generate perfect SEO meta tags for any webpage.",              status:"pending",     uses:0,       badge:"",        builtBy:"ai-forge", createdAt:"2025-01-08", featured:false },
];

const CATEGORIES = ["all","text","image","dev","seo","ai","finance","security","pdf"];

const STATUS_CONFIG: Record<ToolStatus, { label: string; color: string; bg: string }> = {
  live:         { label: "Live",         color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20"  },
  coming_soon:  { label: "Coming Soon",  color: "text-gray-400",   bg: "bg-gray-400/10 border-gray-400/20"    },
  pending:      { label: "Pending",      color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20"},
  disabled:     { label: "Disabled",     color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20"      },
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ tool, onSave, onClose }: {
  tool: Tool;
  onSave: (t: Tool) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...tool });
  const set = (k: keyof Tool, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#13131F] border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-white">Edit Tool</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Tool Name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all resize-none" />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as ToolStatus)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all">
              <option value="live">Live</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="pending">Pending Review</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {/* Category + Icon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all">
                {CATEGORIES.filter(c => c !== "all").map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Icon (emoji)</label>
              <input value={form.icon} onChange={(e) => set("icon", e.target.value)} maxLength={4}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all text-center text-xl" />
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Badge (optional)</label>
            <select value={form.badge} onChange={(e) => set("badge", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all">
              <option value="">None</option>
              <option value="🔥 Hot">🔥 Hot</option>
              <option value="⭐ Top">⭐ Top</option>
              <option value="🆕 New">🆕 New</option>
              <option value="🤖 AI">🤖 AI</option>
            </select>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between bg-[#0A0A14] rounded-xl px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-white">Featured on Homepage</div>
              <div className="text-xs text-gray-500">Show in the Featured Tools section</div>
            </div>
            <button
              onClick={() => set("featured", !form.featured)}
              className={`w-12 h-6 rounded-full transition-all relative ${form.featured ? "bg-[#6C3AFF]" : "bg-gray-700"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.featured ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white font-bold text-sm transition-all">
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold text-sm transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Tool Modal ───────────────────────────────────────────────────────────

function AddToolModal({ onAdd, onClose }: {
  onAdd: (t: Tool) => void;
  onClose: () => void;
}) {
  const blank: Tool = {
    id: String(Date.now()), name: "", slug: "", category: "text",
    icon: "🔧", description: "", status: "coming_soon", uses: 0,
    badge: "", builtBy: "team", createdAt: new Date().toISOString().split("T")[0], featured: false,
  };
  const [form, setForm] = useState(blank);
  const set = (k: keyof Tool, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onAdd({ ...form, slug });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#13131F] border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-white">Add New Tool</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Tool Name *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Base64 Encoder"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all placeholder-gray-600" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Slug (auto-generated if empty)</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
              placeholder="e.g. base64-encoder"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all placeholder-gray-600 font-mono" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2}
              placeholder="What does this tool do?"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all resize-none placeholder-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none text-sm">
                {CATEGORIES.filter(c => c !== "all").map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Icon</label>
              <input value={form.icon} onChange={(e) => set("icon", e.target.value)} maxLength={4}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none text-sm text-center text-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as ToolStatus)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none text-sm">
                <option value="live">Live</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Badge</label>
              <select value={form.badge} onChange={(e) => set("badge", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none text-sm">
                <option value="">None</option>
                <option value="🔥 Hot">🔥 Hot</option>
                <option value="⭐ Top">⭐ Top</option>
                <option value="🆕 New">🆕 New</option>
                <option value="🤖 AI">🤖 AI</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white font-bold text-sm transition-all">
            Cancel
          </button>
          <button onClick={handleAdd} disabled={!form.name.trim()}
            className="flex-1 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white font-bold text-sm transition-all">
            Add Tool
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminToolsPage() {
  const [tools,       setTools]       = useState<Tool[]>(INITIAL_TOOLS);
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("all");
  const [statusFilter,setStatusFilter]= useState("all");
  const [editTool,    setEditTool]    = useState<Tool | null>(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);
  const [toast,       setToast]       = useState("");

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let t = [...tools];
    if (catFilter    !== "all") t = t.filter((x) => x.category === catFilter);
    if (statusFilter !== "all") t = t.filter((x) => x.status   === statusFilter);
    if (search.trim())          t = t.filter((x) =>
      x.name.toLowerCase().includes(search.toLowerCase()) ||
      x.description.toLowerCase().includes(search.toLowerCase())
    );
    return t;
  }, [tools, catFilter, statusFilter, search]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const toggleStatus = (id: string) => {
    setTools((prev) => prev.map((t) =>
      t.id === id ? { ...t, status: t.status === "live" ? "disabled" : "live" } : t
    ));
    showToast("Tool status updated ✅");
  };

  const saveTool = (updated: Tool) => {
    setTools((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    showToast("Tool saved ✅");
  };

  const addTool = (t: Tool) => {
    setTools((prev) => [t, ...prev]);
    showToast("Tool added ✅");
  };

  const deleteTool = (id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
    showToast("Tool deleted 🗑️");
  };

  const toggleFeatured = (id: string) => {
    setTools((prev) => prev.map((t) => t.id === id ? { ...t, featured: !t.featured } : t));
    showToast("Featured status updated ✅");
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const liveCount     = tools.filter((t) => t.status === "live").length;
  const pendingCount  = tools.filter((t) => t.status === "pending").length;
  const featuredCount = tools.filter((t) => t.featured).length;
  const totalUses     = tools.reduce((s, t) => s + t.uses, 0);

  return (
    <div className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {/* ── Modals ── */}
      {editTool && <EditModal tool={editTool} onSave={saveTool} onClose={() => setEditTool(null)} />}
      {showAdd  && <AddToolModal onAdd={addTool} onClose={() => setShowAdd(false)} />}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131F] border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-extrabold text-white mb-2">Delete Tool?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white font-bold text-sm transition-all">
                Cancel
              </button>
              <button onClick={() => deleteTool(deleteId)}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Tools Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage, edit and control every tool on PursTech.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30 self-start">
          + Add New Tool
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Tools",   value: tools.length,                    color: "text-violet-400" },
          { label: "Live",          value: liveCount,                       color: "text-green-400"  },
          { label: "Pending Review",value: pendingCount,                    color: "text-yellow-400" },
          { label: "Total Uses",    value: `${(totalUses/1000000).toFixed(1)}M`, color: "text-cyan-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all" />
        </div>

        {/* Category filter */}
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-gray-400 text-sm focus:outline-none focus:border-[#6C3AFF]/50 transition-all">
          <option value="all">All Categories</option>
          {CATEGORIES.filter(c => c !== "all").map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        {/* Status filter */}
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-gray-400 text-sm focus:outline-none focus:border-[#6C3AFF]/50 transition-all">
          <option value="all">All Statuses</option>
          <option value="live">Live</option>
          <option value="coming_soon">Coming Soon</option>
          <option value="pending">Pending</option>
          <option value="disabled">Disabled</option>
        </select>

        <span className="text-sm text-gray-500 self-center">
          {filtered.length} of {tools.length} tools
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div className="col-span-4">Tool</div>
          <div className="col-span-2 hidden md:block">Category</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 hidden lg:block">Uses</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-sm">No tools match your filters</div>
          </div>
        ) : (
          filtered.map((tool) => {
            const sc = STATUS_CONFIG[tool.status];
            return (
              <div key={tool.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">

                {/* Tool name */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{tool.name}</div>
                    <div className="text-xs text-gray-600 font-mono truncate">/tools/{tool.slug}</div>
                  </div>
                  {tool.featured && (
                    <span className="text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-1.5 py-0.5 rounded-full flex-shrink-0 hidden sm:inline">
                      ⭐
                    </span>
                  )}
                </div>

                {/* Category */}
                <div className="col-span-2 hidden md:block">
                  <span className="text-xs text-gray-500 capitalize bg-[#0A0A14] px-2.5 py-1 rounded-lg">
                    {tool.category}
                  </span>
                </div>

                {/* Status badge */}
                <div className="col-span-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${sc.color} ${sc.bg}`}>
                    {sc.label}
                  </span>
                </div>

                {/* Uses */}
                <div className="col-span-2 hidden lg:block">
                  <span className="text-sm text-gray-400 font-mono">
                    {tool.uses > 0 ? `${(tool.uses/1000).toFixed(0)}K` : "—"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1.5">

                  {/* Toggle live/disabled */}
                  <button onClick={() => toggleStatus(tool.id)} title={tool.status === "live" ? "Disable" : "Enable"}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      tool.status === "live"
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                    }`}>
                    {tool.status === "live" ? "✓" : "○"}
                  </button>

                  {/* Feature toggle */}
                  <button onClick={() => toggleFeatured(tool.id)} title="Toggle Featured"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      tool.featured
                        ? "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"
                        : "bg-gray-500/10 text-gray-600 hover:text-gray-400 hover:bg-gray-500/20"
                    }`}>
                    ⭐
                  </button>

                  {/* Edit */}
                  <button onClick={() => setEditTool(tool)} title="Edit"
                    className="w-8 h-8 rounded-lg bg-[#6C3AFF]/10 text-[#6C3AFF] hover:bg-[#6C3AFF]/20 flex items-center justify-center text-sm transition-all">
                    ✏️
                  </button>

                  {/* Preview */}
                  {tool.status === "live" && (
                    <Link href={`/tools/${tool.slug}`} target="_blank" title="Preview"
                      className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center text-sm transition-all">
                      👁
                    </Link>
                  )}

                  {/* Delete */}
                  <button onClick={() => setDeleteId(tool.id)} title="Delete"
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-sm transition-all">
                    🗑
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── AI Build prompt ── */}
      <div className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-2xl">🤖</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-0.5">Let AI Build Your Next Tool</div>
          <div className="text-xs text-gray-500">
            The Forge AI Agent can build a complete tool from just a name. Go to the Agents panel to trigger it.
          </div>
        </div>
        <Link href="/admin/agents"
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">
          Go to Agents →
        </Link>
      </div>

    </div>
  );
}
