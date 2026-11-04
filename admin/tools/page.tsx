"use client";

// app/admin/tools/page.tsx — v2
// ─────────────────────────────────────────────────────────────────────────────
// Tools Manager — responsive upgrade.
//
// WHAT CHANGED vs v1:
//  • Mobile (< md): tools render as CARDS instead of a crushed 12-col table.
//    Full-width rows, readable text, action buttons in their own row.
//  • Desktop (≥ md): clean table layout preserved.
//  • REAL USAGE DATA: fetches /api/admin/stats and maps total_uses onto each
//    tool. No more hardcoded uses:0 — top tools show actual Supabase numbers.
//  • New "Sort by usage" toggle to instantly see your most-used tools.
//  • Edit modal: safer on small screens (h-dvh aware, scrollable).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";

type ToolStatus = "live" | "coming_soon" | "pending" | "disabled";
type BuiltBy    = "team" | "ai-forge";

interface Tool {
  id: string; name: string; slug: string; category: string;
  icon: string; description: string; status: ToolStatus;
  uses: number; badge: string; builtBy: BuiltBy;
  createdAt: string; featured: boolean;
}

// ── All 50 live tools ─────────────────────────────────────────────────────────

const INITIAL_TOOLS: Tool[] = [
  // ── Text (5) ──────────────────────────────────────────────────────────────
  { id:"t1",  name:"Word Counter",              slug:"word-counter",               category:"text",     icon:"📝", description:"Count words, characters, sentences and paragraphs instantly. Shows reading time and keyword frequency.",    status:"live", uses:0, badge:"⭐ Top",  builtBy:"team", createdAt:"2025-01-01", featured:true  },
  { id:"t2",  name:"Case Converter",            slug:"case-converter",             category:"text",     icon:"🔤", description:"Convert text to UPPER, lower, Title, Sentence or camelCase.",                                             status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-01", featured:false },
  { id:"t3",  name:"Lorem Ipsum Generator",     slug:"lorem-ipsum",                category:"text",     icon:"📄", description:"Generate placeholder lorem ipsum text — words, sentences or paragraphs.",                                 status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-01", featured:false },
  { id:"t4",  name:"Diff Checker",              slug:"diff-checker",               category:"text",     icon:"🔍", description:"Compare two texts side by side and highlight every addition and deletion.",                               status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-01", featured:false },
  { id:"t5",  name:"Text to Speech",            slug:"text-to-speech",             category:"text",     icon:"🔊", description:"Convert any text to natural-sounding audio in multiple voices and languages.",                            status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-01", featured:false },
  // ── Dev (14) ──────────────────────────────────────────────────────────────
  { id:"d1",  name:"JSON Formatter",            slug:"json-formatter",             category:"dev",      icon:"💻", description:"Format, validate, minify and explore JSON with syntax highlighting and error detection.",                  status:"live", uses:0, badge:"⭐ Top",  builtBy:"team", createdAt:"2025-01-02", featured:true  },
  { id:"d2",  name:"Base64 Encoder",            slug:"base64-encoder",             category:"dev",      icon:"🔐", description:"Encode and decode Base64 strings and files entirely in the browser.",                                      status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-02", featured:false },
  { id:"d3",  name:"URL Encoder",               slug:"url-encoder",                category:"dev",      icon:"🔗", description:"Encode and decode URLs and query strings for web applications.",                                          status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-02", featured:false },
  { id:"d4",  name:"UUID Generator",            slug:"uuid-generator",             category:"dev",      icon:"🎲", description:"Generate cryptographically random UUID v4 values — single or bulk.",                                      status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-02", featured:false },
  { id:"d5",  name:"QR Code Generator",         slug:"qr-code-generator",          category:"dev",      icon:"🔲", description:"Generate QR codes for URLs, WiFi, vCard, email or plain text. PNG and SVG download.",                    status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-02", featured:true  },
  { id:"d6",  name:"Hash Generator",            slug:"hash-generator",             category:"dev",      icon:"🔑", description:"Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.",                                         status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-02", featured:false },
  { id:"d7",  name:"CSS Minifier",              slug:"css-minifier",               category:"dev",      icon:"🎨", description:"Minify CSS — removes whitespace, comments and redundant rules.",                                          status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-02", featured:false },
  { id:"d8",  name:"HTML Minifier",             slug:"html-minifier",              category:"dev",      icon:"🗜", description:"Minify HTML to reduce file size and improve page load speed.",                                            status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-02", featured:false },
  { id:"d9",  name:"Regex Tester",              slug:"regex-tester",               category:"dev",      icon:"🧪", description:"Test and debug regular expressions with live match highlighting and 20 pattern examples.",               status:"live", uses:0, badge:"🔥 Hot",  builtBy:"team", createdAt:"2025-02-01", featured:false },
  { id:"d10", name:"JS Minifier",               slug:"js-minifier",                category:"dev",      icon:"⚡", description:"Minify JavaScript with multi-pass compression and gzip size estimation.",                                status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-01", featured:false },
  { id:"d11", name:"HTML to Markdown",          slug:"html-to-markdown",           category:"dev",      icon:"📝", description:"Convert HTML code to clean Markdown format with GFM table support.",                                    status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-01", featured:false },
  { id:"d12", name:"Markdown Editor",           slug:"markdown-editor",            category:"dev",      icon:"✍️", description:"Write Markdown with a live split-pane preview and 15-button toolbar.",                                  status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-01", featured:false },
  { id:"d13", name:"Color Code Converter",      slug:"color-code-converter",       category:"dev",      icon:"🖌", description:"Convert between HEX, RGB, RGBA, HSL, HSLA, HSV and CMYK. WCAG contrast checker included.",              status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-01", featured:false },
  { id:"d14", name:"SVG Editor",                slug:"svg-editor",                 category:"dev",      icon:"✦",  description:"Edit SVG with live preview, React JSX export, SVG optimizer, animation snippets and PNG export.",        status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
  // ── Image (6) ─────────────────────────────────────────────────────────────
  { id:"i1",  name:"Color Picker",              slug:"color-picker",               category:"image",    icon:"🎨", description:"Pick colors and get HEX, RGB, HSL, CMYK and CSS variable codes instantly.",                              status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-03", featured:false },
  { id:"i2",  name:"Image Compressor",          slug:"image-compressor",           category:"image",    icon:"🗜", description:"Compress JPEG, PNG and WebP images by up to 90%. Batch processing. Browser-based.",                     status:"live", uses:0, badge:"🔥 Hot",  builtBy:"team", createdAt:"2025-03-01", featured:true  },
  { id:"i3",  name:"Image Resizer",             slug:"image-resizer",              category:"image",    icon:"📐", description:"Resize images to any dimension with 20+ social media presets and aspect ratio lock.",                   status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-03-01", featured:false },
  { id:"i4",  name:"Background Remover",        slug:"background-remover",         category:"image",    icon:"✂️", description:"Remove image backgrounds automatically using AI. Runs entirely in the browser.",                        status:"live", uses:0, badge:"🤖 AI",   builtBy:"team", createdAt:"2025-03-01", featured:false },
  { id:"i5",  name:"Favicon Generator",         slug:"favicon-generator",          category:"image",    icon:"🏷", description:"Create favicons from image, text or emoji. All 18 standard sizes. PWA manifest included.",             status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-03-01", featured:false },
  { id:"i6",  name:"Image to Text (OCR)",       slug:"image-to-text",              category:"image",    icon:"📷", description:"Extract text from images using Tesseract OCR. 30+ languages. Camera capture supported.",               status:"live", uses:0, badge:"🔥 Hot",  builtBy:"team", createdAt:"2025-03-01", featured:true  },
  // ── SEO (5) ───────────────────────────────────────────────────────────────
  { id:"s1",  name:"Meta Tag Generator",        slug:"meta-tag-generator",         category:"seo",      icon:"🏷", description:"Generate SEO meta tags with live SERP preview, SEO grade A–F, Open Graph and Twitter Card.",           status:"live", uses:0, badge:"🔥 Hot",  builtBy:"team", createdAt:"2025-02-15", featured:true  },
  { id:"s2",  name:"Robots.txt Generator",      slug:"robots-txt-generator",       category:"seo",      icon:"🤖", description:"Generate robots.txt with directives for all major crawlers including GPTBot and ClaudeBot.",           status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-15", featured:false },
  { id:"s3",  name:"Keyword Density Checker",   slug:"keyword-density-checker",    category:"seo",      icon:"🔢", description:"Analyse keyword frequency and density in any text or webpage content.",                                 status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-15", featured:false },
  { id:"s4",  name:"Open Graph Generator",      slug:"open-graph-generator",       category:"seo",      icon:"📊", description:"Generate Open Graph and Twitter Card tags with live previews for all major platforms.",                status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-15", featured:false },
  { id:"s5",  name:"Sitemap Generator",         slug:"sitemap-generator",          category:"seo",      icon:"🗺", description:"Generate XML sitemaps with smart auto-priority, bulk URL import and Google Ping.",                     status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-02-15", featured:false },
  // ── Finance (10) ──────────────────────────────────────────────────────────
  { id:"f1",  name:"Age Calculator",            slug:"age-calculator",             category:"finance",  icon:"🎂", description:"Calculate exact age in years, months and days from any date.",                                          status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-05", featured:false },
  { id:"f2",  name:"BMI Calculator",            slug:"bmi-calculator",             category:"finance",  icon:"⚖️", description:"Calculate Body Mass Index and healthy weight range. Metric and imperial support.",                     status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-05", featured:false },
  { id:"f3",  name:"Percentage Calculator",     slug:"percentage-calculator",      category:"finance",  icon:"🔢", description:"Calculate percentages, increases, decreases and differences between values.",                          status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-05", featured:false },
  { id:"f4",  name:"Unit Converter",            slug:"unit-converter",             category:"finance",  icon:"📏", description:"Convert length, weight, temperature, volume and speed units.",                                         status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-05", featured:false },
  { id:"f5",  name:"Currency Converter",        slug:"currency-converter",         category:"finance",  icon:"💱", description:"Convert currencies with live exchange rates. 170+ currencies.",                                        status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-05", featured:false },
  { id:"f6",  name:"Loan Calculator",           slug:"loan-calculator",            category:"finance",  icon:"🏦", description:"Calculate monthly payments, total interest and full amortization schedule.",                            status:"live", uses:0, badge:"🔥 Hot",  builtBy:"team", createdAt:"2025-04-01", featured:false },
  { id:"f7",  name:"Compound Interest Calc",    slug:"compound-interest-calculator",category:"finance", icon:"📈", description:"Calculate compound interest and investment growth with 6 compounding frequencies.",                   status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-04-01", featured:false },
  { id:"f8",  name:"Tip Calculator",            slug:"tip-calculator",             category:"finance",  icon:"🍽", description:"Calculate tips and split bills. 8 service presets, itemized splitting, round-up mode.",               status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-04-01", featured:false },
  { id:"f9",  name:"Time Zone Converter",       slug:"time-zone-converter",        category:"finance",  icon:"🕐", description:"Convert times between 65+ world cities with DST awareness and meeting overlap finder.",               status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-04-01", featured:false },
  { id:"f10", name:"Mortgage Calculator",       slug:"mortgage-calculator",        category:"finance",  icon:"🏠", description:"Full PITI with PMI, 28/36 affordability rule, amortization and rent vs buy comparison.",               status:"live", uses:0, badge:"⭐ Top",  builtBy:"team", createdAt:"2025-04-01", featured:false },
  // ── Security (3) ──────────────────────────────────────────────────────────
  { id:"sc1", name:"Password Generator",        slug:"password-generator",         category:"security", icon:"🔐", description:"Generate cryptographically secure passwords with strength meter and bulk generation.",                 status:"live", uses:0, badge:"",        builtBy:"team", createdAt:"2025-01-04", featured:true  },
  { id:"sc2", name:"SSL Certificate Checker",   slug:"ssl-checker",                category:"security", icon:"🔒", description:"Check any website's SSL — grade A+ to F, expiry countdown, TLS version, SANs and cipher suite.",   status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
  { id:"sc3", name:"IP Address Lookup",         slug:"ip-lookup",                  category:"security", icon:"🌐", description:"Look up any IP — country, ISP, ASN, risk score 0-100, reverse DNS, live timezone clock.",            status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
  // ── PDF (5) ───────────────────────────────────────────────────────────────
  { id:"p1",  name:"PDF Compressor",            slug:"pdf-compressor",             category:"pdf",      icon:"🗜", description:"Compress PDFs by up to 80% with 3 compression levels. Metadata strip. Batch ZIP download.",           status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:true  },
  { id:"p2",  name:"PDF Merger",                slug:"pdf-merger",                 category:"pdf",      icon:"📑", description:"Merge multiple PDFs with drag-to-reorder, per-file page ranges and custom metadata.",                 status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
  { id:"p3",  name:"PDF Splitter",              slug:"pdf-splitter",               category:"pdf",      icon:"✂️", description:"Split PDFs every page, by range, or extract/remove specific pages. ZIP download.",                  status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
  { id:"p4",  name:"PDF to Word",               slug:"pdf-to-word",                category:"pdf",      icon:"📝", description:"Extract text from PDFs with page preview. Export as .doc, .txt or .html.",                          status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
  { id:"p5",  name:"Word to PDF",               slug:"word-to-pdf",                category:"pdf",      icon:"📄", description:"Convert text or .txt files to PDF. A4/Letter/Legal, custom margins, page numbers.",                  status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
  // ── AI (2) ────────────────────────────────────────────────────────────────
  { id:"ai1", name:"Grammar Checker",           slug:"grammar-checker",            category:"ai",       icon:"✓",  description:"Grammar, spelling and style checking powered by LanguageTool's 6,000+ rules. Passive voice detector.", status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:true  },
  { id:"ai2", name:"Readability Checker",       slug:"readability-checker",        category:"ai",       icon:"📊", description:"7 readability formulas, target audience mode, sentence difficulty map and famous text benchmarks.",   status:"live", uses:0, badge:"🆕 New",  builtBy:"team", createdAt:"2025-05-01", featured:false },
];

const CATEGORIES = ["all","text","image","dev","seo","ai","finance","security","pdf"];

const STATUS_CONFIG: Record<ToolStatus, { label: string; color: string; bg: string }> = {
  live:        { label:"Live",        color:"text-green-400",  bg:"bg-green-400/10 border-green-400/20"   },
  coming_soon: { label:"Coming Soon", color:"text-gray-400",   bg:"bg-gray-400/10 border-gray-400/20"     },
  pending:     { label:"Pending",     color:"text-yellow-400", bg:"bg-yellow-400/10 border-yellow-400/20" },
  disabled:    { label:"Disabled",    color:"text-red-400",    bg:"bg-red-400/10 border-red-400/20"       },
};

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n/1e6).toFixed(1)}M`
  : n >= 1_000   ? `${(n/1e3).toFixed(1)}K`
  : String(n);

// ── Edit Modal — mobile-safe (dvh height, internal scroll) ───────────────────

function EditModal({ tool, onSave, onClose }: { tool: Tool; onSave: (t: Tool) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...tool });
  const set = (k: keyof Tool, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#13131F] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-white">Edit Tool</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl p-1 -m-1">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Tool Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value as ToolStatus)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none text-sm">
                <option value="live">Live</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Badge</label>
              <select value={form.badge} onChange={e => set("badge", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none text-sm">
                <option value="">None</option>
                <option value="🔥 Hot">🔥 Hot</option>
                <option value="⭐ Top">⭐ Top</option>
                <option value="🆕 New">🆕 New</option>
                <option value="🤖 AI">🤖 AI</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between bg-[#0A0A14] rounded-xl px-4 py-3">
            <div className="pr-3">
              <div className="text-sm font-semibold text-white">Featured on Homepage</div>
              <div className="text-xs text-gray-500">Show in Featured Tools section</div>
            </div>
            <button onClick={() => set("featured", !form.featured)}
              className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${form.featured ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.featured ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pb-[env(safe-area-inset-bottom)]">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white font-bold text-sm transition-all">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold text-sm transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ── Action buttons — shared between card + table layouts ─────────────────────

function ToolActions({ tool, onToggleStatus, onToggleFeatured, onEdit, onDelete }: {
  tool: Tool;
  onToggleStatus: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onEdit: (t: Tool) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onToggleStatus(tool.id)} title={tool.status === "live" ? "Disable" : "Enable"}
        className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm transition-all ${tool.status === "live" ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"}`}>
        {tool.status === "live" ? "✓" : "○"}
      </button>
      <button onClick={() => onToggleFeatured(tool.id)} title="Toggle Featured"
        className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm transition-all ${tool.featured ? "bg-yellow-400/10 text-yellow-400" : "bg-gray-500/10 text-gray-600 hover:text-gray-400"}`}>⭐</button>
      <button onClick={() => onEdit(tool)}
        className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[#6C3AFF]/10 text-[#6C3AFF] hover:bg-[#6C3AFF]/20 flex items-center justify-center text-sm transition-all">✏️</button>
      {tool.status === "live" && (
        <Link href={`/tools/${tool.slug}`} target="_blank"
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center text-sm transition-all">👁</Link>
      )}
      <button onClick={() => onDelete(tool.id)}
        className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-sm transition-all">🗑</button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminToolsPage() {
  const [tools,        setTools]        = useState<Tool[]>(INITIAL_TOOLS);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortByUsage,  setSortByUsage]  = useState(true);
  const [editTool,     setEditTool]     = useState<Tool | null>(null);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [toast,        setToast]        = useState("");
  const [usageLoaded,  setUsageLoaded]  = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // ── REAL USAGE DATA — pull from the existing stats endpoint ──────────────
  const loadUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) return;
      const data = await res.json();
      const usageMap: Record<string, number> = {};
      (data?.topTools ?? []).forEach((t: { tool_slug: string; total_uses: number }) => {
        usageMap[t.tool_slug] = Number(t.total_uses) || 0;
      });
      if (Object.keys(usageMap).length > 0) {
        setTools(prev => prev.map(t => ({ ...t, uses: usageMap[t.slug] ?? 0 })));
        setUsageLoaded(true);
      }
    } catch {
      // Silent — usage column just stays at 0
    }
  }, []);

  useEffect(() => { loadUsage(); }, [loadUsage]);

  const filtered = useMemo(() => {
    let t = [...tools];
    if (catFilter    !== "all") t = t.filter(x => x.category === catFilter);
    if (statusFilter !== "all") t = t.filter(x => x.status   === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      t = t.filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q) || x.slug.includes(q));
    }
    if (sortByUsage) t.sort((a, b) => b.uses - a.uses);
    return t;
  }, [tools, catFilter, statusFilter, search, sortByUsage]);

  const saveTool      = (u: Tool) => { setTools(p => p.map(t => t.id === u.id ? u : t)); showToast("Tool saved ✅"); };
  const deleteTool    = (id: string) => { setTools(p => p.filter(t => t.id !== id)); setDeleteId(null); showToast("Tool deleted 🗑️"); };
  const toggleStatus  = (id: string) => { setTools(p => p.map(t => t.id === id ? { ...t, status: t.status === "live" ? "disabled" : "live" } : t)); showToast("Status updated ✅"); };
  const toggleFeatured= (id: string) => { setTools(p => p.map(t => t.id === id ? { ...t, featured: !t.featured } : t)); showToast("Featured updated ✅"); };

  const liveCount     = tools.filter(t => t.status === "live").length;
  const featuredCount = tools.filter(t => t.featured).length;
  const totalUses     = tools.reduce((s, t) => s + t.uses, 0);

  return (
    <div className="space-y-5 sm:space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-6 left-4 sm:left-auto bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 text-center sm:text-left">{toast}</div>
      )}
      {editTool && <EditModal tool={editTool} onSave={saveTool} onClose={() => setEditTool(null)} />}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131F] border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-extrabold text-white mb-2">Delete Tool?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 font-bold text-sm">Cancel</button>
              <button onClick={() => deleteTool(deleteId)} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Tools Manager</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            {usageLoaded
              ? "Usage data live from Supabase · top 10 tools shown with real counts"
              : "All 50 live tools"}
          </p>
        </div>
        <Link href="/tools" target="_blank"
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#6C3AFF]/20 hover:bg-[#6C3AFF] border border-[#6C3AFF]/30 text-[#6C3AFF] hover:text-white font-bold text-sm transition-all self-start">
          View Live Tools →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label:"Total Tools",    value:tools.length,    color:"text-violet-400" },
          { label:"Live",           value:liveCount,       color:"text-green-400"  },
          { label:"Tracked Uses",   value:fmt(totalUses),  color:"text-cyan-400"   },
          { label:"Featured",       value:featuredCount,   color:"text-yellow-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-3.5 sm:p-4 text-center">
            <div className={`text-xl sm:text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters — stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search 50 tools..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all" />
        </div>
        <div className="flex gap-2.5 sm:gap-3">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-gray-400 text-sm focus:outline-none">
            <option value="all">All Categories</option>
            {CATEGORIES.filter(c => c !== "all").map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-gray-400 text-sm focus:outline-none">
            <option value="all">All Statuses</option>
            <option value="live">Live</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Sort toggle + result count */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setSortByUsage(v => !v)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
            sortByUsage
              ? "bg-[#6C3AFF] text-white border-transparent"
              : "bg-[#13131F] text-gray-400 border-white/5 hover:text-white"
          }`}>
          📊 Sort by usage {sortByUsage ? "✓" : ""}
        </button>
        <span className="text-xs sm:text-sm text-gray-500">{filtered.length} of {tools.length} tools</span>
      </div>

      {/* ════ MOBILE: card list (hidden ≥ md) ════ */}
      <div className="space-y-2.5 md:hidden">
        {filtered.map(tool => {
          const sc = STATUS_CONFIG[tool.status];
          return (
            <div key={tool.id} className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              {/* Row 1: icon + name + status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm flex items-center gap-1.5 flex-wrap">
                      <span className="truncate">{tool.name}</span>
                      {tool.featured && <span className="text-[10px]">⭐</span>}
                    </div>
                    <div className="text-[11px] text-gray-600 font-mono truncate">/tools/{tool.slug}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold flex-shrink-0 ${sc.color} ${sc.bg}`}>{sc.label}</span>
              </div>

              {/* Row 2: meta badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-[10px] text-gray-500 capitalize bg-[#0A0A14] px-2 py-0.5 rounded-md">{tool.category}</span>
                {tool.badge && <span className="text-[10px] text-gray-400 bg-[#0A0A14] px-2 py-0.5 rounded-md">{tool.badge}</span>}
                {tool.uses > 0 && (
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-md">
                    {fmt(tool.uses)} uses
                  </span>
                )}
              </div>

              {/* Row 3: actions — own full-width row, no cramping */}
              <ToolActions tool={tool} onToggleStatus={toggleStatus} onToggleFeatured={toggleFeatured}
                onEdit={setEditTool} onDelete={setDeleteId} />
            </div>
          );
        })}
      </div>

      {/* ════ DESKTOP: table (hidden < md) ════ */}
      <div className="hidden md:block bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div className="col-span-4">Tool</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Uses</div>
          <div className="col-span-1 hidden lg:block">Badge</div>
          <div className="col-span-3 lg:col-span-3 text-right">Actions</div>
        </div>
        {filtered.map(tool => {
          const sc = STATUS_CONFIG[tool.status];
          return (
            <div key={tool.id} className="grid grid-cols-12 gap-3 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">{tool.icon}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm truncate flex items-center gap-1.5">
                    <span className="truncate">{tool.name}</span>
                    {tool.featured && <span className="text-[10px] flex-shrink-0">⭐</span>}
                  </div>
                  <div className="text-xs text-gray-600 font-mono truncate">/tools/{tool.slug}</div>
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-xs text-gray-500 capitalize bg-[#0A0A14] px-2 py-1 rounded-lg">{tool.category}</span>
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${sc.color} ${sc.bg}`}>{sc.label}</span>
              </div>
              <div className="col-span-1">
                {tool.uses > 0
                  ? <span className="text-xs font-bold text-cyan-400">{fmt(tool.uses)}</span>
                  : <span className="text-xs text-gray-700">—</span>}
              </div>
              <div className="col-span-1 hidden lg:block">
                {tool.badge ? <span className="text-xs text-gray-400 whitespace-nowrap">{tool.badge}</span> : <span className="text-xs text-gray-700">—</span>}
              </div>
              <div className="col-span-3 flex justify-end">
                <ToolActions tool={tool} onToggleStatus={toggleStatus} onToggleFeatured={toggleFeatured}
                  onEdit={setEditTool} onDelete={setDeleteId} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="text-2xl">📊</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-0.5">
            {usageLoaded ? "Usage counts are live from Supabase" : "Usage data loading…"}
          </div>
          <div className="text-xs text-gray-500">
            The stats API returns your top 10 tools by usage — those show real counts here.
            Tools outside the top 10 show "—" until they accumulate enough uses to rank.
          </div>
        </div>
        <Link href="/admin" className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Dashboard →</Link>
      </div>
    </div>
  );
}
