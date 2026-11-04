"use client";

// app/admin/blog/page.tsx — v2
// ─────────────────────────────────────────────────────────────────────────────
// Blog Manager — responsive upgrade + REAL data.
//
// WHAT CHANGED vs v1:
//  • Post list updated to the REAL 14 published posts with CURRENT slugs:
//    3 renamed slugs fixed (no more dead -2025 links), 4 new June 2026
//    articles added (PDF compress, PDF merge, loan extra payments, WebP vs
//    JPEG vs PNG).
//  • Mobile (< md): cards instead of crushed 12-col table.
//  • Desktop (≥ md): table preserved.
//  • Fake "Quill AI generates a post in 1.8s" simulation removed — honest
//    Phase 6 placeholder instead.
//  • Mobile-safe edit modal (bottom sheet, dvh-aware).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import Link from "next/link";

type PostStatus = "published" | "draft" | "scheduled" | "archived";
type WrittenBy  = "team" | "ai-quill";

interface BlogPost {
  id:          string;
  title:       string;
  slug:        string;
  excerpt:     string;
  status:      PostStatus;
  writtenBy:   WrittenBy;
  tags:        string[];
  views:       number;
  seoScore:    number;
  wordCount:   number;
  publishedAt: string;
  createdAt:   string;
}

// ── Real blog posts — all 14 live at purstech.com/blog/[slug] ────────────────
// Slugs verified against app/blog/data.ts (June 2026 refresh).

const INITIAL_POSTS: BlogPost[] = [
  // ── NEW — June 5, 2026 (AEO/GEO-optimised) ─────────────────────────────
  {
    id:"11",
    title:"How to Compress a PDF Without Losing Quality",
    slug:"compress-pdf-without-losing-quality",
    excerpt:"Step-by-step guide to shrinking PDF file size while keeping text sharp — free, in your browser, no upload.",
    status:"published", writtenBy:"team", tags:["pdf","compress","free tools"],
    views:0, seoScore:93, wordCount:1650, publishedAt:"Jun 2026", createdAt:"2026-06-05",
  },
  {
    id:"12",
    title:"How to Merge PDF Files Without Uploading Them",
    slug:"merge-pdf-files-without-uploading",
    excerpt:"Combine multiple PDFs into one file directly in your browser. Private, free, nothing leaves your device.",
    status:"published", writtenBy:"team", tags:["pdf","merge","privacy"],
    views:0, seoScore:92, wordCount:1580, publishedAt:"Jun 2026", createdAt:"2026-06-05",
  },
  {
    id:"13",
    title:"Loan Calculator With Extra Payments: Pay Off Faster",
    slug:"loan-calculator-with-extra-payments",
    excerpt:"See how extra monthly payments cut years — and thousands in interest — off your loan, with worked examples.",
    status:"published", writtenBy:"team", tags:["finance","loan","calculator"],
    views:0, seoScore:90, wordCount:1720, publishedAt:"Jun 2026", createdAt:"2026-06-05",
  },
  {
    id:"14",
    title:"WebP vs JPEG vs PNG in 2026: Which Format Wins?",
    slug:"webp-vs-jpeg-vs-png-2026",
    excerpt:"Compression, quality, transparency and browser support compared — and when to use each image format.",
    status:"published", writtenBy:"team", tags:["image","webp","formats"],
    views:0, seoScore:91, wordCount:1690, publishedAt:"Jun 2026", createdAt:"2026-06-05",
  },
  // ── Refreshed June 2026 (3 slugs de-year-suffixed) ─────────────────────
  {
    id:"1",
    title:"Best Free JSON Formatter Tools Online",
    slug:"best-free-json-formatter-tools",
    excerpt:"Discover the top free JSON formatter tools available online. Compare features, speed and ease of use.",
    status:"published", writtenBy:"ai-quill", tags:["json","dev tools","free tools"],
    views:0, seoScore:94, wordCount:1480, publishedAt:"Upd. Jun 2026", createdAt:"2025-01-08",
  },
  {
    id:"2",
    title:"How to Compress Images Without Losing Quality",
    slug:"how-to-compress-images-without-losing-quality",
    excerpt:"Step-by-step guide to compressing JPEG, PNG and WebP images online for free with no quality loss.",
    status:"published", writtenBy:"ai-quill", tags:["image tools","compress","free"],
    views:0, seoScore:91, wordCount:1240, publishedAt:"Upd. Jun 2026", createdAt:"2025-01-10",
  },
  {
    id:"3",
    title:"How to Create a Strong Password (Complete Guide)",
    slug:"strong-password-guide",
    excerpt:"Learn what makes a password truly secure. Step-by-step guide with expert recommendations.",
    status:"published", writtenBy:"ai-quill", tags:["security","password","cybersecurity"],
    views:0, seoScore:89, wordCount:1560, publishedAt:"Upd. Jun 2026", createdAt:"2025-01-12",
  },
  {
    id:"4",
    title:"HEX vs RGB vs HSL: Which Color Format Should You Use?",
    slug:"hex-vs-rgb-vs-hsl-color-formats",
    excerpt:"A complete guide to understanding color formats for web designers and developers. When to use each.",
    status:"published", writtenBy:"ai-quill", tags:["design","color","css","dev"],
    views:0, seoScore:87, wordCount:1380, publishedAt:"Upd. Jun 2026", createdAt:"2025-01-14",
  },
  {
    id:"5",
    title:"QR Codes for Business: The Complete Guide",
    slug:"qr-codes-for-business-complete-guide",
    excerpt:"Everything businesses need to know about QR codes — from restaurant menus to payments and marketing.",
    status:"published", writtenBy:"ai-quill", tags:["qr code","business","marketing"],
    views:0, seoScore:86, wordCount:1620, publishedAt:"Upd. Jun 2026", createdAt:"2025-01-16",
  },
  {
    id:"6",
    title:"Base64 Encoding Explained for Developers",
    slug:"base64-encoding-explained",
    excerpt:"What is Base64 encoding, how does it work, and when should you use it? A practical developer's guide.",
    status:"published", writtenBy:"ai-quill", tags:["base64","encoding","dev tools"],
    views:0, seoScore:88, wordCount:1290, publishedAt:"Upd. Jun 2026", createdAt:"2025-01-18",
  },
  {
    id:"7",
    title:"BMI Calculator: What Your Score Actually Means",
    slug:"bmi-calculator-guide-what-your-score-means",
    excerpt:"Understand your BMI score, what it means for your health, and how to interpret results accurately.",
    status:"published", writtenBy:"ai-quill", tags:["bmi","health","calculator"],
    views:0, seoScore:85, wordCount:1450, publishedAt:"Upd. Jun 2026", createdAt:"2025-01-20",
  },
  {
    id:"8",
    title:"URL Encoding: A Developer's Complete Guide",
    slug:"url-encoding-developer-guide",
    excerpt:"Everything you need to know about URL encoding, percent-encoding, and when to use encodeURIComponent vs encodeURI.",
    status:"published", writtenBy:"ai-quill", tags:["url","encoding","javascript","dev"],
    views:0, seoScore:90, wordCount:1340, publishedAt:"Upd. Jun 2026", createdAt:"2025-02-01",
  },
  {
    id:"9",
    title:"Free SEO Tools That Actually Work",
    slug:"free-seo-tools-that-work",
    excerpt:"A curated list of free SEO tools that deliver real results — no expensive subscriptions needed.",
    status:"published", writtenBy:"ai-quill", tags:["seo","free tools","marketing"],
    views:0, seoScore:92, wordCount:1780, publishedAt:"Upd. Jun 2026", createdAt:"2025-02-05",
  },
  {
    id:"10",
    title:"Word Count Guide: Ideal Length for Every Platform",
    slug:"word-count-guide-every-platform",
    excerpt:"The ideal word count for blog posts, tweets, emails, YouTube descriptions and every platform.",
    status:"published", writtenBy:"ai-quill", tags:["writing","word count","content"],
    views:0, seoScore:88, wordCount:1520, publishedAt:"Upd. Jun 2026", createdAt:"2025-02-10",
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PostStatus, { label: string; color: string; bg: string }> = {
  published: { label:"Published", color:"text-green-400",  bg:"bg-green-400/10 border-green-400/20"   },
  draft:     { label:"Draft",     color:"text-gray-400",   bg:"bg-gray-400/10 border-gray-400/20"     },
  scheduled: { label:"Scheduled", color:"text-yellow-400", bg:"bg-yellow-400/10 border-yellow-400/20" },
  archived:  { label:"Archived",  color:"text-red-400",    bg:"bg-red-400/10 border-red-400/20"       },
};

function SeoBar({ score }: { score: number }) {
  const color = score >= 85 ? "bg-green-500" : score >= 65 ? "bg-yellow-400" : "bg-red-500";
  const text  = score >= 85 ? "text-green-400" : score >= 65 ? "text-yellow-400" : "text-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#0A0A14] rounded-full h-1.5 w-16">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${text} w-6`}>{score}</span>
    </div>
  );
}

// ─── Edit Modal — mobile-safe ─────────────────────────────────────────────────

function WriteModal({ post, onSave, onClose, isNew }: {
  post: BlogPost; onSave: (p: BlogPost) => void; onClose: () => void; isNew: boolean;
}) {
  const [form, setForm] = useState({ ...post });
  const set = (k: keyof BlogPost, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#13131F] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-2xl max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-white">
            {isNew ? "✍️ New Blog Post" : "✏️ Edit Post"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl p-1 -m-1">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Post Title *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Best Free Image Compression Tools"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all placeholder-gray-600" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Excerpt / Meta Description</label>
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3}
              placeholder="Short description (150-160 chars ideal)"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all resize-none placeholder-gray-600" />
            <div className="text-right text-xs text-gray-600 mt-1">{form.excerpt.length} chars</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">URL Slug</label>
            <div className="flex items-center gap-2 bg-[#0A0A14] border border-white/5 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-600 flex-shrink-0">purstech.com/blog/</span>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                className="flex-1 bg-transparent text-white focus:outline-none text-sm font-mono min-w-0" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Tags (comma separated)</label>
            <input value={form.tags.join(", ")}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
              placeholder="json, dev tools, free"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all placeholder-gray-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as PostStatus)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Word Count</label>
              <div className="px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white text-sm">
                {form.wordCount > 0 ? `~${form.wordCount.toLocaleString()} words` : "Not set"}
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A14] border border-white/5 rounded-xl px-4 py-3 text-xs text-gray-500">
            ℹ️ Reminder: this manager is a reference list. Real posts live in{" "}
            <code className="bg-[#13131F] px-1 rounded text-[#6C3AFF]">app/blog/data.ts</code> — edit that file
            in GitHub to change the live site.
          </div>
        </div>

        <div className="flex gap-3 mt-6 pb-[env(safe-area-inset-bottom)]">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white font-bold text-sm transition-all">
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!form.title.trim()}
            className="flex-1 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white font-bold text-sm transition-all">
            {isNew ? "Add to List" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post actions — shared by card + table layouts ───────────────────────────

function PostActions({ post, onTogglePublish, onEdit, onDelete }: {
  post: BlogPost;
  onTogglePublish: (id: string) => void;
  onEdit: (p: BlogPost) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onTogglePublish(post.id)} title={post.status === "published" ? "Unpublish" : "Publish"}
        className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm transition-all ${post.status === "published" ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"}`}>
        {post.status === "published" ? "✓" : "○"}
      </button>
      <button onClick={() => onEdit(post)}
        className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[#6C3AFF]/10 text-[#6C3AFF] hover:bg-[#6C3AFF]/20 flex items-center justify-center text-sm transition-all">
        ✏️
      </button>
      {post.status === "published" && (
        <Link href={`/blog/${post.slug}`} target="_blank"
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center text-sm transition-all">
          👁
        </Link>
      )}
      <button onClick={() => onDelete(post.id)}
        className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-sm transition-all">
        🗑
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const [posts,        setPosts]        = useState<BlogPost[]>(INITIAL_POSTS);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editPost,     setEditPost]     = useState<BlogPost | null>(null);
  const [isNew,        setIsNew]        = useState(false);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [toast,        setToast]        = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = useMemo(() => {
    let p = [...posts];
    if (statusFilter !== "all") p = p.filter(x => x.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      p = p.filter(x => x.title.toLowerCase().includes(q) || x.slug.includes(q) || x.tags.some(t => t.includes(q)));
    }
    return p; // keeps data order: newest June articles first
  }, [posts, statusFilter, search]);

  const savePost = (updated: BlogPost) => {
    if (isNew) {
      setPosts(p => [{ ...updated, id: String(Date.now()), views: 0, publishedAt: "Just now", createdAt: new Date().toISOString().split("T")[0] }, ...p]);
      showToast("✅ Added to list");
    } else {
      setPosts(p => p.map(x => x.id === updated.id ? updated : x));
      showToast("✅ Saved");
    }
  };

  const deletePost = (id: string) => { setPosts(p => p.filter(x => x.id !== id)); setDeleteId(null); showToast("🗑️ Removed from list"); };
  const togglePublish = (id: string) => { setPosts(p => p.map(x => x.id === id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x)); showToast("✅ Status updated"); };
  const openNew = () => { setIsNew(true); setEditPost({ id:"", title:"", slug:"", excerpt:"", status:"draft", writtenBy:"team", tags:[], views:0, seoScore:0, wordCount:0, publishedAt:"—", createdAt:"" }); };

  const publishedCount = posts.filter(p => p.status === "published").length;
  const newJuneCount   = posts.filter(p => p.createdAt.startsWith("2026-06")).length;
  const avgSeo         = Math.round(posts.filter(p => p.seoScore > 0).reduce((s, p) => s + p.seoScore, 0) / Math.max(posts.filter(p => p.seoScore > 0).length, 1));

  return (
    <div className="space-y-5 sm:space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-6 left-4 sm:left-auto bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 text-center sm:text-left">{toast}</div>
      )}
      {editPost && <WriteModal post={editPost} onSave={savePost} onClose={() => { setEditPost(null); setIsNew(false); }} isNew={isNew} />}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131F] border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-extrabold text-white mb-2">Remove From List?</h3>
            <p className="text-gray-500 text-sm mb-6">This only removes it from this manager view — the live post on the site is not affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 font-bold text-sm">Cancel</button>
              <button onClick={() => deletePost(deleteId)} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Blog Manager</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">All {posts.length} published posts · slugs match live routes</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30 self-start">
          ✍️ New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label:"Published",      value:publishedCount,   color:"text-green-400"  },
          { label:"Total Posts",    value:posts.length,     color:"text-cyan-400"   },
          { label:"New (Jun 2026)", value:newJuneCount,     color:"text-yellow-400" },
          { label:"Avg SEO Score",  value:`${avgSeo}/100`,  color:"text-violet-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-3.5 sm:p-4 text-center">
            <div className={`text-xl sm:text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Honest Quill placeholder (fake generator removed) */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
        <span className="text-3xl">✍️</span>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">Quill — SEO Writer Agent</div>
          <div className="text-xs text-gray-500">Automated post writing arrives in Phase 6. For now, posts are managed in <code className="bg-[#0A0A14] px-1 rounded text-[#6C3AFF]">app/blog/data.ts</code>.</div>
        </div>
        <span className="text-xs bg-[#0A0A14] text-gray-600 px-3 py-1.5 rounded-lg flex-shrink-0">Phase 6</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all" />
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-gray-400 text-sm focus:outline-none transition-all">
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{filtered.length} posts</span>
        </div>
      </div>

      {/* ════ MOBILE: card list (hidden ≥ md) ════ */}
      <div className="space-y-2.5 md:hidden">
        {filtered.map(post => {
          const sc = STATUS_CONFIG[post.status];
          return (
            <div key={post.id} className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="font-semibold text-white text-sm leading-snug flex items-center gap-1.5 flex-wrap min-w-0">
                  <span>{post.title}</span>
                  {post.writtenBy === "ai-quill" && (
                    <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-400/20 px-1.5 py-0.5 rounded-full flex-shrink-0">🤖 AI</span>
                  )}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold flex-shrink-0 ${sc.color} ${sc.bg}`}>{sc.label}</span>
              </div>
              <div className="text-[11px] text-gray-600 font-mono truncate mb-2">/blog/{post.slug}</div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                {post.tags.slice(0,3).map(tag => (
                  <span key={tag} className="text-[10px] bg-[#0A0A14] text-gray-600 px-2 py-0.5 rounded-md">{tag}</span>
                ))}
                <span className="text-[10px] text-gray-500 bg-[#0A0A14] px-2 py-0.5 rounded-md">{(post.wordCount/1000).toFixed(1)}K words</span>
                <span className="text-[10px] text-gray-500 bg-[#0A0A14] px-2 py-0.5 rounded-md">{post.publishedAt}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 max-w-[120px]">
                  {post.seoScore > 0 && <SeoBar score={post.seoScore} />}
                </div>
                <PostActions post={post} onTogglePublish={togglePublish}
                  onEdit={(p) => { setIsNew(false); setEditPost(p); }} onDelete={setDeleteId} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ════ DESKTOP: table (hidden < md) ════ */}
      <div className="hidden md:block bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div className="col-span-5">Post</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 hidden lg:block">SEO</div>
          <div className="col-span-1">Words</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filtered.map(post => {
          const sc = STATUS_CONFIG[post.status];
          return (
            <div key={post.id} className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
              <div className="col-span-5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-white text-sm truncate leading-snug">{post.title}</span>
                  {post.writtenBy === "ai-quill" && (
                    <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-400/20 px-1.5 py-0.5 rounded-full flex-shrink-0">🤖 AI</span>
                  )}
                </div>
                <div className="text-xs text-gray-600 font-mono truncate">/blog/{post.slug}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {post.tags.slice(0,3).map(tag => (
                    <span key={tag} className="text-[10px] bg-[#0A0A14] text-gray-600 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                  <span className="text-[10px] text-gray-700 px-1.5 py-0.5">{post.publishedAt}</span>
                </div>
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${sc.color} ${sc.bg}`}>{sc.label}</span>
              </div>
              <div className="col-span-2 hidden lg:block">
                {post.seoScore > 0 ? <SeoBar score={post.seoScore} /> : <span className="text-xs text-gray-600">—</span>}
              </div>
              <div className="col-span-1">
                <span className="text-xs text-gray-400">{post.wordCount > 0 ? `${(post.wordCount/1000).toFixed(1)}K` : "—"}</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <PostActions post={post} onTogglePublish={togglePublish}
                  onEdit={(p) => { setIsNew(false); setEditPost(p); }} onDelete={setDeleteId} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon:"🎯", title:"AEO/GEO format",   desc:"All 14 posts follow the answer-first format: 40-word direct answer, comparison tables, FAQ schema. Keep this for new posts." },
          { icon:"📅", title:"Content freshness", desc:"All posts refreshed June 5, 2026. Next refresh cycle: after AdSense approval — don't touch content before July." },
          { icon:"🔗", title:"Source of truth",   desc:"This page is a reference list. The live blog reads from app/blog/data.ts — edit that file to change the site." },
        ].map(tip => (
          <div key={tip.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 sm:p-5">
            <div className="text-2xl mb-2">{tip.icon}</div>
            <div className="text-sm font-bold text-white mb-1">{tip.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{tip.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
