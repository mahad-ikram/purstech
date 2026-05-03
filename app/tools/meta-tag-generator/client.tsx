"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { META_TAG_FAQ } from "./page";

// ── Templates ──────────────────────────────────────────────────────────────────
const TEMPLATES = {
  "Blog Post": {
    title: "How to [Topic] — Complete Guide [Year]",
    description: "Learn how to [topic] with our step-by-step guide. Discover [benefit 1], [benefit 2] and expert tips to help you [achieve goal] faster.",
    robots: "index, follow", ogType: "article",
  },
  "Homepage": {
    title: "[Brand] — [Primary Value Proposition] | [Category]",
    description: "[Brand] helps you [primary benefit]. [Differentiator]. Try it free — no signup required.",
    robots: "index, follow", ogType: "website",
  },
  "Product Page": {
    title: "Buy [Product Name] — [Key Benefit] | [Brand]",
    description: "[Product name] — [key feature]. [Social proof or urgency]. Free shipping. [CTA].",
    robots: "index, follow", ogType: "product",
  },
  "Landing Page": {
    title: "[Offer]: [Specific Outcome] in [Timeframe]",
    description: "Discover how [audience] can [achieve outcome] without [pain point]. [Social proof]. Start free today.",
    robots: "index, follow", ogType: "website",
  },
  "Local Business": {
    title: "[Service] in [City] — [Business Name]",
    description: "Looking for [service] in [city]? [Business name] offers [key services]. [Trust signal]. Call [phone] or book online.",
    robots: "index, follow", ogType: "website",
  },
  "No-Index Page": {
    title: "", description: "", robots: "noindex, nofollow", ogType: "website",
  },
};

// ── SEO Grader ─────────────────────────────────────────────────────────────────
function getSEOGrade(title: string, description: string) {
  let score = 0;
  const issues: string[] = [];
  const tips: string[] = [];

  // Title scoring
  if (title.length === 0) { issues.push("Title tag is empty"); }
  else if (title.length < 30) { score += 5; issues.push("Title is too short (under 30 chars)"); }
  else if (title.length <= 60) { score += 20; }
  else { score += 10; issues.push("Title is too long (over 60 chars, will be truncated)"); }

  // Description scoring
  if (description.length === 0) { issues.push("Meta description is empty"); }
  else if (description.length < 70) { score += 5; issues.push("Description is too short (under 70 chars)"); }
  else if (description.length <= 160) { score += 20; }
  else { score += 10; issues.push("Description too long (over 160 chars, will be truncated)"); }

  // Content quality hints
  if (title.length > 0 && description.length > 0) {
    if (!/[|–—-]/.test(title)) tips.push("Consider adding a separator (| or —) and brand name to your title");
    if (!/\b(free|best|how|guide|top|easy|fast|now|today|[0-9])\b/i.test(title)) {
      tips.push("Power words like 'Free', 'Best', 'Guide' in titles boost click-through rates");
    }
    if (description.length > 0 && !/[.!]$/.test(description)) {
      tips.push("End your meta description with a call to action or period");
    }
    score += 15; // Bonus for having both
  }

  const grade = score >= 50 ? "A" : score >= 40 ? "B" : score >= 25 ? "C" : score >= 15 ? "D" : "F";
  const color = grade === "A" ? "text-green-400" : grade === "B" ? "text-cyan-400" : grade === "C" ? "text-yellow-400" : "text-[#FF3A6C]";

  return { grade, score, color, issues, tips };
}

interface MetaFields {
  title: string; description: string; author: string; robots: string;
  canonical: string; viewport: string; charset: string;
  ogTitle: string; ogDescription: string; ogImage: string;
  ogUrl: string; ogType: string; ogSiteName: string;
  twitterCard: string; twitterTitle: string; twitterDesc: string;
  twitterImage: string; twitterHandle: string;
}

const DEFAULTS: MetaFields = {
  title: "", description: "", author: "", robots: "index, follow",
  canonical: "", viewport: "width=device-width, initial-scale=1.0", charset: "UTF-8",
  ogTitle: "", ogDescription: "", ogImage: "", ogUrl: "", ogType: "website", ogSiteName: "",
  twitterCard: "summary_large_image", twitterTitle: "", twitterDesc: "",
  twitterImage: "", twitterHandle: "",
};

function CharBadge({ val, max }: { val: string; max: number }) {
  const len = val.length;
  const over = len > max;
  const warn = len > max * 0.9;
  return (
    <span className={`text-xs font-mono ${over ? "text-[#FF3A6C]" : warn ? "text-yellow-400" : "text-gray-500"}`}>
      {len}/{max}
    </span>
  );
}

export default function MetaTagGeneratorClient() {
  const [fields, setFields]   = useState<MetaFields>(DEFAULTS);
  const [tab, setTab]         = useState<"basic" | "og" | "twitter">("basic");
  const [serpView, setSerpView] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied]   = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>("");

  const set = (k: keyof MetaFields) => (v: string) =>
    setFields(prev => ({ ...prev, [k]: v }));

  const syncAndSet = (k: keyof MetaFields, v: string) => {
    setFields(prev => {
      const next = { ...prev, [k]: v };
      if (k === "title") {
        if (!prev.ogTitle)      next.ogTitle      = v;
        if (!prev.twitterTitle) next.twitterTitle = v;
      }
      if (k === "description") {
        if (!prev.ogDescription) next.ogDescription = v;
        if (!prev.twitterDesc)   next.twitterDesc   = v;
      }
      return next;
    });
  };

  function applyTemplate(name: string) {
    const t = TEMPLATES[name as keyof typeof TEMPLATES];
    setFields(prev => ({ ...prev, ...t, ogType: t.ogType }));
    setActiveTemplate(name);
  }

  const grade = useMemo(() => getSEOGrade(fields.title, fields.description), [fields.title, fields.description]);

  function buildTag(tag: string): string {
    const lines: string[] = [];
    if (tag === "basic") {
      if (fields.charset)     lines.push(`<meta charset="${fields.charset}">`);
      if (fields.viewport)    lines.push(`<meta name="viewport" content="${fields.viewport}">`);
      if (fields.title)       lines.push(`<title>${fields.title}</title>`);
      if (fields.description) lines.push(`<meta name="description" content="${fields.description}">`);
      if (fields.author)      lines.push(`<meta name="author" content="${fields.author}">`);
      if (fields.robots)      lines.push(`<meta name="robots" content="${fields.robots}">`);
      if (fields.canonical)   lines.push(`<link rel="canonical" href="${fields.canonical}">`);
    }
    if (tag === "og") {
      lines.push(`<meta property="og:type" content="${fields.ogType}">`);
      if (fields.ogUrl)         lines.push(`<meta property="og:url" content="${fields.ogUrl}">`);
      if (fields.ogTitle)       lines.push(`<meta property="og:title" content="${fields.ogTitle}">`);
      if (fields.ogDescription) lines.push(`<meta property="og:description" content="${fields.ogDescription}">`);
      if (fields.ogImage)       lines.push(`<meta property="og:image" content="${fields.ogImage}">`);
      if (fields.ogSiteName)    lines.push(`<meta property="og:site_name" content="${fields.ogSiteName}">`);
    }
    if (tag === "twitter") {
      lines.push(`<meta name="twitter:card" content="${fields.twitterCard}">`);
      if (fields.twitterHandle) lines.push(`<meta name="twitter:site" content="${fields.twitterHandle}">`);
      if (fields.twitterTitle)  lines.push(`<meta name="twitter:title" content="${fields.twitterTitle}">`);
      if (fields.twitterDesc)   lines.push(`<meta name="twitter:description" content="${fields.twitterDesc}">`);
      if (fields.twitterImage)  lines.push(`<meta name="twitter:image" content="${fields.twitterImage}">`);
    }
    return lines.join("\n");
  }

  const fullOutput = [
    "<!-- Basic SEO -->",
    buildTag("basic"),
    "",
    "<!-- Open Graph / Social -->",
    buildTag("og"),
    "",
    "<!-- Twitter / X Card -->",
    buildTag("twitter"),
  ].join("\n");

  function copyTag(key: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const displayTitle  = fields.title       || "Your Page Title";
  const displayDesc   = fields.description || "Your meta description will appear here in Google search results.";
  const displayUrl    = fields.ogUrl       || "https://yourwebsite.com/page";

  // Desktop SERP snippet width simulation
  const titleTrunc  = fields.title.length > 60  ? fields.title.slice(0, 57)  + "..." : fields.title  || "Your Page Title";
  const descTrunc   = fields.description.length > 160 ? fields.description.slice(0, 157) + "..." : fields.description || "Your meta description appears here in Google search results. Make it compelling to increase clicks.";
  const mobileTitleTrunc = fields.title.length > 55 ? fields.title.slice(0, 52) + "..." : fields.title || "Your Page Title";
  const mobileDescTrunc  = fields.description.length > 120 ? fields.description.slice(0, 117) + "..." : fields.description || "Your meta description appears here in Google search results.";

  const tabs = [
    { id: "basic" as const,   label: "🔍 Basic SEO"   },
    { id: "og" as const,      label: "📘 Open Graph"  },
    { id: "twitter" as const, label: "𝕏 Twitter Card" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog"  className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Meta Tag Generator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Online Meta Tag Generator
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Generate perfectly optimised meta tags for SEO, Open Graph and Twitter Cards. Get a live SEO grade, mobile & desktop SERP preview, and copy individual tags or all at once.
          </p>
        </div>

        {/* Templates */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">⚡ Quick Templates</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(TEMPLATES).map(name => (
              <button key={name} onClick={() => applyTemplate(name)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  activeTemplate === name
                    ? "bg-[#6C3AFF] text-white border-transparent"
                    : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white hover:border-[#6C3AFF]/30"
                }`}>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* ── Left col: inputs (3/5) ── */}
          <div className="xl:col-span-3 space-y-4">

            {/* Tab switcher */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-1 flex gap-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    tab === t.id ? "bg-[#6C3AFF] text-white shadow" : "text-gray-400 hover:text-white"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-5">

              {/* Basic SEO */}
              {tab === "basic" && <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-white">Page Title</label>
                    <CharBadge val={fields.title} max={60} />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">50–60 characters. Include your primary keyword near the start.</p>
                  <input value={fields.title} onChange={e => syncAndSet("title", e.target.value)}
                    placeholder="Free Online JSON Formatter — Format & Validate JSON | PursTech"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-white">Meta Description</label>
                    <CharBadge val={fields.description} max={160} />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">150–160 characters. Include a benefit and a call to action.</p>
                  <textarea value={fields.description} onChange={e => syncAndSet("description", e.target.value)}
                    rows={3} placeholder="Format, validate and minify JSON instantly. Browser-based — your data never leaves your device. Free, no login required."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">Author</label>
                    <input value={fields.author} onChange={e => set("author")(e.target.value)}
                      placeholder="PursTech Team"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">Robots</label>
                    <select value={fields.robots} onChange={e => set("robots")(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="index, nofollow">index, nofollow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Canonical URL <span className="text-gray-500 font-normal">(prevents duplicate content)</span>
                  </label>
                  <input value={fields.canonical} onChange={e => set("canonical")(e.target.value)}
                    placeholder="https://yoursite.com/page"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>
              </>}

              {/* Open Graph */}
              {tab === "og" && <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-white">OG Title</label>
                    <CharBadge val={fields.ogTitle} max={60} />
                  </div>
                  <input value={fields.ogTitle} onChange={e => set("ogTitle")(e.target.value)}
                    placeholder="Auto-filled from title — or customise for social"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-white">OG Description</label>
                    <CharBadge val={fields.ogDescription} max={160} />
                  </div>
                  <textarea value={fields.ogDescription} onChange={e => set("ogDescription")(e.target.value)}
                    rows={3} placeholder="Description shown when shared on Facebook, LinkedIn, WhatsApp..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    OG Image URL <span className="text-gray-500 font-normal text-xs">(recommended: 1200×630px)</span>
                  </label>
                  <input value={fields.ogImage} onChange={e => set("ogImage")(e.target.value)}
                    placeholder="https://yoursite.com/og-image.png"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  {fields.ogImage && (
                    <p className="text-xs text-yellow-400 mt-1">
                      ⚠ Keep image under 8MB. Facebook minimum is 200×200px.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">Page URL</label>
                    <input value={fields.ogUrl} onChange={e => set("ogUrl")(e.target.value)}
                      placeholder="https://yoursite.com/page"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">Site Name</label>
                    <input value={fields.ogSiteName} onChange={e => set("ogSiteName")(e.target.value)}
                      placeholder="PursTech"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Content Type</label>
                  <select value={fields.ogType} onChange={e => set("ogType")(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                    {["website","article","product","profile","video.movie","music.song","book"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </>}

              {/* Twitter */}
              {tab === "twitter" && <>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Card Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "summary_large_image", label: "Large Image", desc: "Big image + title + desc" },
                      { value: "summary",             label: "Summary",     desc: "Small thumbnail + text"  },
                    ].map(c => (
                      <button key={c.value} onClick={() => set("twitterCard")(c.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          fields.twitterCard === c.value
                            ? "border-[#6C3AFF] bg-[#6C3AFF]/10"
                            : "border-white/5 bg-[#0A0A14] hover:border-white/10"
                        }`}>
                        <div className="text-sm font-semibold text-white">{c.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-white">Twitter Title</label>
                    <CharBadge val={fields.twitterTitle} max={70} />
                  </div>
                  <input value={fields.twitterTitle} onChange={e => set("twitterTitle")(e.target.value)}
                    placeholder="Auto-filled from title — or customise for Twitter"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-white">Twitter Description</label>
                    <CharBadge val={fields.twitterDesc} max={200} />
                  </div>
                  <textarea value={fields.twitterDesc} onChange={e => set("twitterDesc")(e.target.value)}
                    rows={3} placeholder="Description shown on Twitter/X card previews..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Image URL</label>
                  <input value={fields.twitterImage} onChange={e => set("twitterImage")(e.target.value)}
                    placeholder="https://yoursite.com/twitter-card.png"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Twitter Handle</label>
                  <input value={fields.twitterHandle} onChange={e => set("twitterHandle")(e.target.value)}
                    placeholder="@purstech"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>
              </>}
            </div>
          </div>

          {/* ── Right col: previews + output (2/5) ── */}
          <div className="xl:col-span-2 flex flex-col gap-4">

            {/* SEO Grade */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">SEO Grade</h3>
              <div className="flex items-center gap-4">
                <div className={`text-5xl font-extrabold ${grade.color}`}>{grade.grade}</div>
                <div className="flex-1">
                  <div className="h-2 bg-[#0A0A14] rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all ${
                      grade.grade === "A" ? "bg-green-500" : grade.grade === "B" ? "bg-cyan-500" : grade.grade === "C" ? "bg-yellow-500" : "bg-[#FF3A6C]"
                    }`} style={{ width: `${grade.score}%` }} />
                  </div>
                  <div className="text-xs text-gray-500">{grade.score}/55 points</div>
                </div>
              </div>
              {grade.issues.length > 0 && (
                <div className="mt-3 space-y-1">
                  {grade.issues.map((issue, i) => (
                    <div key={i} className="text-xs text-[#FF3A6C] flex items-start gap-1.5">
                      <span className="flex-shrink-0 mt-0.5">⚠</span>{issue}
                    </div>
                  ))}
                </div>
              )}
              {grade.tips.length > 0 && (
                <div className="mt-2 space-y-1">
                  {grade.tips.map((tip, i) => (
                    <div key={i} className="text-xs text-yellow-400 flex items-start gap-1.5">
                      <span className="flex-shrink-0 mt-0.5">💡</span>{tip}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SERP Preview */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Google Preview</h3>
                <div className="flex gap-1 bg-[#0A0A14] rounded-lg p-0.5">
                  {(["desktop","mobile"] as const).map(v => (
                    <button key={v} onClick={() => setSerpView(v)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        serpView === v ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                      }`}>
                      {v === "desktop" ? "🖥" : "📱"}
                    </button>
                  ))}
                </div>
              </div>

              {serpView === "desktop" ? (
                <div className="bg-white rounded-xl p-4 max-w-[600px]">
                  <div className="text-xs text-green-700 mb-0.5 flex items-center gap-1 truncate">
                    <span className="bg-green-50 border border-green-200 rounded px-1 text-xs">G</span>
                    {displayUrl}
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="text-blue-700 text-[17px] font-medium leading-snug mb-1 line-clamp-1 hover:underline cursor-pointer">
                    {titleTrunc}
                  </div>
                  <div className="text-gray-600 text-sm leading-snug line-clamp-2">{descTrunc}</div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-3 max-w-[375px] shadow-sm">
                  <div className="text-xs text-green-700 mb-0.5 truncate">{displayUrl}</div>
                  <div className="text-blue-700 text-base font-medium leading-snug mb-0.5 line-clamp-1">
                    {mobileTitleTrunc}
                  </div>
                  <div className="text-gray-500 text-xs leading-snug line-clamp-3">{mobileDescTrunc}</div>
                </div>
              )}
            </div>

            {/* Generated Code with per-section copy */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated HTML</h3>
                <button onClick={() => copyTag("all", fullOutput)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copied === "all" ? "bg-green-600 text-white" : "bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white"
                  }`}>
                  {copied === "all" ? "✓ All Copied!" : "Copy All"}
                </button>
              </div>

              {/* Per-section copy buttons */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {[
                  { key: "basic",   label: "Basic SEO" },
                  { key: "og",      label: "Open Graph" },
                  { key: "twitter", label: "Twitter" },
                ].map(s => (
                  <button key={s.key} onClick={() => copyTag(s.key, buildTag(s.key))}
                    className={`px-3 py-1 rounded-lg text-xs transition-all border ${
                      copied === s.key
                        ? "bg-green-600 text-white border-transparent"
                        : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {copied === s.key ? "✓" : "Copy"} {s.label}
                  </button>
                ))}
              </div>

              <pre className="flex-1 text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 overflow-auto whitespace-pre-wrap font-mono leading-relaxed min-h-[200px]">
                {fullOutput}
              </pre>
              <button onClick={() => setFields(DEFAULTS)}
                className="mt-3 text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors text-right">
                × Reset all fields
              </button>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Meta Tag Generator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Choose a template",   desc: "Pick a page type template to auto-fill recommended structures for your content type." },
              { step: "2", title: "Fill Basic SEO",       desc: "Enter your title (50–60 chars) and description (150–160 chars). Watch the live SEO grade update." },
              { step: "3", title: "Add social tags",      desc: "Switch to Open Graph and Twitter tabs. Most fields auto-fill from your basic inputs — customise as needed." },
              { step: "4", title: "Copy into your site",  desc: "Use Copy All or copy individual sections. Paste everything inside your HTML <head> before </head>." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {META_TAG_FAQ.map((faq, i) => (
              <details key={i}
                className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
