"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_POSTS: BlogPost[] = [
  {
    id:"1", title:"Best Free JSON Formatter Tools Online in 2025",
    slug:"best-free-json-formatter-tools-2025",
    excerpt:"Discover the top free JSON formatter tools available online. Compare features, speed and ease of use.",
    status:"published", writtenBy:"ai-quill", tags:["json","dev tools","free tools"],
    views:2840, seoScore:94, wordCount:1480, publishedAt:"2 hours ago", createdAt:"2025-01-08",
  },
  {
    id:"2", title:"How to Compress Images Online Without Losing Quality",
    slug:"how-to-compress-images-online-free",
    excerpt:"Step-by-step guide to compressing JPG, PNG and WebP images online for free using PursTech.",
    status:"published", writtenBy:"ai-quill", tags:["image tools","compress","free"],
    views:1920, seoScore:91, wordCount:1240, publishedAt:"3 hours ago", createdAt:"2025-01-08",
  },
  {
    id:"3", title:"Top 10 Free Password Generator Tools — Ranked & Reviewed",
    slug:"best-free-password-generator-tools",
    excerpt:"We tested the top password generator tools. Here is our definitive ranking based on security and ease of use.",
    status:"published", writtenBy:"ai-quill", tags:["security","password","free tools"],
    views:1340, seoScore:88, wordCount:1680, publishedAt:"5 hours ago", createdAt:"2025-01-07",
  },
  {
    id:"4", title:"What is a QR Code and How Does It Work?",
    slug:"what-is-a-qr-code-how-does-it-work",
    excerpt:"Everything you need to know about QR codes — history, how they work and how to generate them for free.",
    status:"draft", writtenBy:"ai-quill", tags:["qr code","explainer"],
    views:0, seoScore:76, wordCount:920, publishedAt:"—", createdAt:"2025-01-08",
  },
  {
    id:"5", title:"HEX vs RGB vs HSL: Which Color Format Should You Use?",
    slug:"hex-vs-rgb-vs-hsl-color-formats",
    excerpt:"A complete guide to understanding color formats for web designers and developers.",
    status:"scheduled", writtenBy:"ai-quill", tags:["design","color","css"],
    views:0, seoScore:82, wordCount:1100, publishedAt:"Tomorrow 9:00 AM", createdAt:"2025-01-08",
  },
  {
    id:"6", title:"PursTech Launch: The World's Largest Free Tool Ecosystem",
    slug:"purstech-launch-worlds-largest-free-tool-ecosystem",
    excerpt:"We built PursTech to give everyone access to professional-grade tools for free. Here is our story.",
    status:"draft", writtenBy:"team", tags:["announcement","purstech"],
    views:0, seoScore:65, wordCount:680, publishedAt:"—", createdAt:"2025-01-05",
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

// ─── Write / Edit Modal ───────────────────────────────────────────────────────

function WriteModal({
  post, onSave, onClose, isNew,
}: {
  post: BlogPost; onSave: (p: BlogPost) => void; onClose: () => void; isNew: boolean;
}) {
  const [form, setForm]       = useState({ ...post });
  const [aiLoading, setAiLoading] = useState(false);
  const set = (k: keyof BlogPost, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleAIGenerate = async () => {
    if (!form.title.trim()) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setForm((f) => ({
      ...f,
      excerpt:   `A comprehensive guide to ${form.title.toLowerCase()}. Learn everything you need to know with step-by-step instructions and expert tips.`,
      wordCount: Math.floor(Math.random() * 600) + 1000,
      seoScore:  Math.floor(Math.random() * 15) + 80,
      writtenBy: "ai-quill" as WrittenBy,
    }));
    setAiLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#13131F] border border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-white">
            {isNew ? "✍️ New Blog Post" : "✏️ Edit Post"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Post Title *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Best Free Image Compression Tools in 2025"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all placeholder-gray-600" />
          </div>

          {/* AI Generate button */}
          <button onClick={handleAIGenerate} disabled={!form.title.trim() || aiLoading}
            className="w-full py-3 rounded-xl bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 border border-[#6C3AFF]/30 text-[#6C3AFF] font-bold text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2">
            {aiLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#6C3AFF]/30 border-t-[#6C3AFF] rounded-full animate-spin" />
                Quill is writing...
              </>
            ) : "✨ Generate with Quill AI"}
          </button>

          {/* Excerpt */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Excerpt / Meta Description</label>
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3}
              placeholder="Short description shown in search results (150-160 characters ideal)"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all resize-none placeholder-gray-600" />
            <div className="text-right text-xs text-gray-600 mt-1">{form.excerpt.length} chars</div>
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">URL Slug</label>
            <div className="flex items-center gap-2 bg-[#0A0A14] border border-white/5 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-600 flex-shrink-0">purstech.com/blog/</span>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                className="flex-1 bg-transparent text-white focus:outline-none text-sm font-mono min-w-0" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Tags (comma separated)</label>
            <input value={form.tags.join(", ")} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
              placeholder="json, dev tools, free"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all placeholder-gray-600" />
          </div>

          {/* Status + word count row */}
          <div className="grid grid-cols-2 gap-3">
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
                {form.wordCount > 0 ? `~${form.wordCount.toLocaleString()} words` : "Not generated yet"}
              </div>
            </div>
          </div>

          {/* SEO score */}
          {form.seoScore > 0 && (
            <div className="bg-[#0A0A14] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">SEO Score</span>
                <span className={`text-sm font-extrabold ${form.seoScore >= 85 ? "text-green-400" : form.seoScore >= 65 ? "text-yellow-400" : "text-red-400"}`}>
                  {form.seoScore}/100
                </span>
              </div>
              <div className="bg-[#13131F] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${form.seoScore >= 85 ? "bg-green-500" : form.seoScore >= 65 ? "bg-yellow-400" : "bg-red-500"}`}
                  style={{ width: `${form.seoScore}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white font-bold text-sm transition-all">
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!form.title.trim()}
            className="flex-1 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white font-bold text-sm transition-all">
            {isNew ? "Publish Post" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const [posts,     setPosts]     = useState<BlogPost[]>(INITIAL_POSTS);
  const [search,    setSearch]    = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editPost,  setEditPost]  = useState<BlogPost | null>(null);
  const [isNew,     setIsNew]     = useState(false);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [toast,     setToast]     = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let p = [...posts];
    if (statusFilter !== "all") p = p.filter((x) => x.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      p = p.filter((x) => x.title.toLowerCase().includes(q) || x.tags.some(t => t.includes(q)));
    }
    return p.sort((a, b) => (b.views - a.views));
  }, [posts, statusFilter, search]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const savePost = (updated: BlogPost) => {
    if (isNew) {
      const newPost = {
        ...updated,
        id: String(Date.now()),
        views: 0,
        publishedAt: updated.status === "published" ? "Just now" : "—",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPosts((p) => [newPost, ...p]);
      showToast("✅ Post created");
    } else {
      setPosts((p) => p.map((x) => x.id === updated.id ? updated : x));
      showToast("✅ Post saved");
    }
  };

  const deletePost = (id: string) => {
    setPosts((p) => p.filter((x) => x.id !== id));
    setDeleteId(null);
    showToast("🗑️ Post deleted");
  };

  const togglePublish = (id: string) => {
    setPosts((p) => p.map((x) =>
      x.id === id
        ? { ...x, status: x.status === "published" ? "draft" : "published",
            publishedAt: x.status !== "published" ? "Just now" : "—" }
        : x
    ));
    showToast("✅ Status updated");
  };

  const openNew = () => {
    setIsNew(true);
    setEditPost({
      id:"", title:"", slug:"", excerpt:"", status:"draft",
      writtenBy:"team", tags:[], views:0, seoScore:0,
      wordCount:0, publishedAt:"—", createdAt:"",
    });
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const publishedCount = posts.filter(p => p.status === "published").length;
  const draftCount     = posts.filter(p => p.status === "draft").length;
  const totalViews     = posts.reduce((s, p) => s + p.views, 0);
  const avgSeo         = Math.round(posts.filter(p => p.seoScore > 0).reduce((s, p) => s + p.seoScore, 0) / posts.filter(p => p.seoScore > 0).length || 0);

  return (
    <div className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50">
          {toast}
        </div>
      )}

      {/* ── Modals ── */}
      {editPost && (
        <WriteModal post={editPost} onSave={savePost} onClose={() => { setEditPost(null); setIsNew(false); }} isNew={isNew} />
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131F] border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-extrabold text-white mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-400 font-bold text-sm transition-all">
                Cancel
              </button>
              <button onClick={() => deletePost(deleteId)}
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
          <h1 className="text-2xl font-extrabold text-white">Blog Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage all blog posts — written by you or Quill AI.</p>
        </div>
        <div className="flex gap-2 self-start">
          <button onClick={openNew}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30">
            ✍️ New Post
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Published",    value:publishedCount, color:"text-green-400"  },
          { label:"Drafts",       value:draftCount,     color:"text-gray-400"   },
          { label:"Total Views",  value:totalViews.toLocaleString(), color:"text-cyan-400" },
          { label:"Avg SEO Score",value:`${avgSeo}/100`,color:"text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quill AI prompt ── */}
      <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl">✍️</span>
            <div>
              <div className="text-sm font-bold text-white">Ask Quill to write a post</div>
              <div className="text-xs text-gray-500">Enter a topic and Quill AI writes a full SEO blog post in seconds</div>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              placeholder="e.g. Best free SEO tools 2025"
              className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    setIsNew(true);
                    setEditPost({
                      id:"", title: val, slug: val.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),
                      excerpt:"", status:"draft", writtenBy:"ai-quill", tags:[], views:0,
                      seoScore:0, wordCount:0, publishedAt:"—", createdAt:"",
                    });
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <button
              className="px-4 py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all whitespace-nowrap">
              Generate →
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/5 text-gray-400 text-sm focus:outline-none transition-all">
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>
        <span className="text-sm text-gray-500">{filtered.length} posts</span>
      </div>

      {/* ── Posts table ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div className="col-span-5">Post</div>
          <div className="col-span-2 hidden md:block">Status</div>
          <div className="col-span-2 hidden lg:block">SEO</div>
          <div className="col-span-1 hidden sm:block">Views</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-600">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-sm">No posts found</div>
          </div>
        ) : (
          filtered.map((post) => {
            const sc = STATUS_CONFIG[post.status];
            return (
              <div key={post.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">

                {/* Title + meta */}
                <div className="col-span-5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-white text-sm truncate leading-snug">
                      {post.title}
                    </span>
                    {post.writtenBy === "ai-quill" && (
                      <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-400/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        🤖 AI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{post.wordCount > 0 ? `${post.wordCount.toLocaleString()} words` : "Draft"}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {post.tags.slice(0,3).map(tag => (
                      <span key={tag} className="text-[10px] bg-[#0A0A14] text-gray-600 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 hidden md:block">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${sc.color} ${sc.bg}`}>
                    {sc.label}
                  </span>
                </div>

                {/* SEO score */}
                <div className="col-span-2 hidden lg:block">
                  {post.seoScore > 0 ? <SeoBar score={post.seoScore} /> : <span className="text-xs text-gray-600">—</span>}
                </div>

                {/* Views */}
                <div className="col-span-1 hidden sm:block">
                  <span className="text-sm text-gray-400 font-mono">
                    {post.views > 0 ? post.views.toLocaleString() : "—"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1.5">
                  {/* Toggle publish */}
                  <button onClick={() => togglePublish(post.id)}
                    title={post.status === "published" ? "Unpublish" : "Publish"}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      post.status === "published"
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                    }`}>
                    {post.status === "published" ? "✓" : "○"}
                  </button>

                  {/* Edit */}
                  <button onClick={() => { setIsNew(false); setEditPost(post); }}
                    className="w-8 h-8 rounded-lg bg-[#6C3AFF]/10 text-[#6C3AFF] hover:bg-[#6C3AFF]/20 flex items-center justify-center text-sm transition-all">
                    ✏️
                  </button>

                  {/* Preview (published only) */}
                  {post.status === "published" && (
                    <Link href={`/blog/${post.slug}`} target="_blank"
                      className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center text-sm transition-all">
                      👁
                    </Link>
                  )}

                  {/* Delete */}
                  <button onClick={() => setDeleteId(post.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-sm transition-all">
                    🗑
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Tips ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon:"🎯", title:"SEO tip", desc:"Posts with scores above 85 rank significantly better. Use Quill AI to automatically optimise all content." },
          { icon:"📅", title:"Posting frequency", desc:"Aim for at least 3 posts per week. Quill AI can handle this automatically once configured in Agent Settings." },
          { icon:"🔗", title:"Internal linking", desc:"Weave Agent automatically links blog posts to relevant tools. Ensure Weave is enabled in the Agents panel." },
        ].map((tip) => (
          <div key={tip.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <div className="text-2xl mb-2">{tip.icon}</div>
            <div className="text-sm font-bold text-white mb-1">{tip.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{tip.desc}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
