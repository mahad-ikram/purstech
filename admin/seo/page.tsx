"use client";

// app/admin/seo/page.tsx — v2
// ─────────────────────────────────────────────────────────────────────────────
// SEO Control Panel — REAL DATA release.
//
// WHAT CHANGED vs v1:
//  • Fictional keyword rankings (#1 unit converter, #2 BMI…) REMOVED.
//    Replaced with the verified GSC snapshot (June 9, 2026 export):
//    648 impressions · 6 clicks · 211 queries · avg position ~78.
//  • "Top pages by impressions" section — your real climbers.
//  • Checklist updated: 14 blog posts, June slug renames + redirects,
//    pending "submit 7 URLs for indexing" task surfaced.
//  • AdSense countdown card — apply window July 1–3, 2026.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

// Snapshot source: GSC performance export, URL-prefix property, ~6 weeks data.
const SNAPSHOT_DATE = "Jun 9, 2026";

const SEO_CHECKS = [
  // ── High priority ──────────────────────────────────────────────────────
  { label:"Sitemap submitted to Google Search Console",   done:true,  priority:"high",   link:null },
  { label:"Domain property verified (TXT @ Vercel DNS)",  done:true,  priority:"high",   link:"https://search.google.com/search-console" },
  { label:"All 50 tools have meta titles + descriptions", done:true,  priority:"high",   link:null },
  { label:"SSL active (www.purstech.com)",                done:true,  priority:"high",   link:null },
  { label:"Canonical tags correct on all pages",          done:true,  priority:"high",   link:null },
  { label:"301: purstech.com → www.purstech.com",         done:true,  priority:"high",   link:null },
  { label:"3 renamed blog slugs 308-redirected",          done:true,  priority:"high",   link:null },
  { label:"Submit 7 URLs for indexing (4 new + 3 renamed)",done:false, priority:"high",  link:"https://search.google.com/search-console" },
  // ── Medium priority ────────────────────────────────────────────────────
  { label:"14 blog posts AEO/GEO-refreshed (Jun 5)",      done:true,  priority:"medium", link:null },
  { label:"robots.ts with AI crawlers allowed",           done:true,  priority:"medium", link:null },
  { label:"JSON-LD schema on all tool pages",             done:true,  priority:"medium", link:null },
  { label:"WebSite + Organization + ItemList schema",     done:true,  priority:"medium", link:null },
  { label:"FAQPage schema on all 14 blog posts",          done:true,  priority:"medium", link:null },
  { label:"Sitemap submitted to Bing Webmaster",          done:true,  priority:"medium", link:"https://www.bing.com/webmasters" },
  { label:"Bing IndexNow key deployed + URLs pinged",     done:true,  priority:"medium", link:null },
  { label:"llms.txt published (AI assistant discovery)",  done:true,  priority:"medium", link:null },
  { label:"Open Graph tags on all pages",                 done:true,  priority:"medium", link:null },
  { label:"Core Web Vitals passing",                      done:false, priority:"medium", link:"https://pagespeed.web.dev" },
  // ── Low priority ───────────────────────────────────────────────────────
  { label:"Image alt tags on all tool screenshots",       done:false, priority:"low",    link:null },
  { label:"Hreflang for international versions",          done:false, priority:"low",    link:null },
];

// ── REAL GSC snapshot (Jun 9, 2026 export · URL-prefix property · ~6 wks) ───

const GSC_TOTALS = [
  { label:"Impressions",  value:"648",  sub:"~6 weeks",        color:"text-cyan-400"   },
  { label:"Clicks",       value:"6",    sub:"organic",         color:"text-green-400"  },
  { label:"Queries",      value:"211",  sub:"unique keywords", color:"text-violet-400" },
  { label:"Avg Position", value:"~78",  sub:"page 8 · normal for new domain", color:"text-yellow-400" },
];

const TOP_PAGES = [
  { page:"/tools/image-to-text",  impressions:270, note:"Top impression earner — OCR queries. Biggest climb candidate.", color:"#6C3AFF" },
  { page:"/tools/image-resizer",  impressions:226, note:"Second highest — resize queries, deep positions but volume is there.", color:"#00D4FF" },
  { page:"/ (homepage)",          impressions:30,  note:"Position ~3.1 · 20% CTR — branded searches converting beautifully.", color:"#00E676" },
];

const PRIORITY_COLORS: Record<string, string> = {
  high:   "text-red-400 bg-red-400/10 border-red-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  low:    "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export default function AdminSEOPage() {
  const [checks, setChecks] = useState(SEO_CHECKS);

  const toggle = (i: number) =>
    setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, done: !c.done } : c));

  const doneCount   = checks.filter(c => c.done).length;
  const totalCount  = checks.length;
  const healthScore = Math.round((doneCount / totalCount) * 100);
  const healthColor = healthScore >= 80 ? "text-green-400" : healthScore >= 50 ? "text-yellow-400" : "text-red-400";
  const barColor    = healthScore >= 80 ? "bg-green-500" : healthScore >= 50 ? "bg-yellow-400" : "bg-red-500";
  const maxImp      = Math.max(...TOP_PAGES.map(p => p.impressions));

  // Days until AdSense window opens (Jul 1, 2026)
  const daysToAdsense = Math.max(0, Math.ceil((new Date("2026-07-01").getTime() - Date.now()) / 86_400_000));

  return (
    <div className="space-y-5 sm:space-y-6">

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">SEO Control Panel</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Real Search Console data · snapshot {SNAPSHOT_DATE}
        </p>
      </div>

      {/* ── AdSense countdown ── */}
      <div className="bg-gradient-to-r from-[#6C3AFF]/15 to-[#00D4FF]/10 border border-[#6C3AFF]/25 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
        <div className="text-3xl">⏳</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">AdSense application window: July 1–3, 2026</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Content freeze in effect — new June articles are aging + indexing. Apply Tuesday/Wednesday morning PKT.
          </div>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="text-2xl font-extrabold text-[#00D4FF]">{daysToAdsense}</div>
          <div className="text-[10px] text-gray-500">days left</div>
        </div>
      </div>

      {/* ── Health score ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Overall SEO Health</h2>
            <p className="text-xs text-gray-500 mt-0.5">{doneCount} of {totalCount} checks passing</p>
          </div>
          <div className={`text-3xl sm:text-4xl font-extrabold ${healthColor}`}>
            {healthScore}<span className="text-xl sm:text-2xl">/100</span>
          </div>
        </div>
        <div className="bg-[#0A0A14] rounded-full h-3">
          <div className={`${barColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${healthScore}%` }} />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {healthScore >= 80
            ? "🟢 Foundation is solid. The remaining work is content aging + link building — both already in motion."
            : healthScore >= 50
            ? "🟡 Good progress — a few items left."
            : "🔴 Critical issues need fixing immediately."}
        </p>
      </div>

      {/* ── REAL GSC totals ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">📊 Search Performance (real)</h2>
          <span className="text-[10px] text-gray-600 bg-[#13131F] border border-white/5 px-2 py-1 rounded-lg">GSC export · {SNAPSHOT_DATE}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {GSC_TOTALS.map((s) => (
            <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-3.5 sm:p-4 text-center">
              <div className={`text-xl sm:text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-[11px] sm:text-xs text-gray-500 mt-1">{s.label}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* SEO Checklist */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 sm:p-5">
          <h2 className="text-sm font-bold text-white mb-1">✅ SEO Checklist</h2>
          <p className="text-xs text-gray-500 mb-4">Click to toggle. {doneCount}/{totalCount} complete.</p>
          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {checks.map((check, i) => (
              <div key={check.label}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors">
                <button onClick={() => toggle(i)}
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                    check.done ? "bg-[#6C3AFF] border-[#6C3AFF]" : "border-gray-600"
                  }`}>
                  {check.done && <span className="text-white text-[10px] font-black">✓</span>}
                </button>
                <span className={`text-xs flex-1 ${check.done ? "text-gray-600 line-through" : "text-gray-300"}`}>
                  {check.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${PRIORITY_COLORS[check.priority]}`}>
                  {check.priority}
                </span>
                {check.link && !check.done && (
                  <a href={check.link} target="_blank" rel="noopener noreferrer"
                    className="text-[#6C3AFF] hover:text-[#00D4FF] text-xs transition-colors flex-shrink-0">
                    Fix →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top pages by impressions — REAL */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 sm:p-5">
          <h2 className="text-sm font-bold text-white mb-1">🏔️ Top Pages by Impressions</h2>
          <p className="text-xs text-gray-500 mb-4">Real GSC data · these are your climbers</p>

          <div className="space-y-4">
            {TOP_PAGES.map((p) => (
              <div key={p.page}>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-sm text-white font-mono truncate">{p.page}</span>
                  <span className="text-xs text-gray-400 font-bold flex-shrink-0">{p.impressions} imp.</span>
                </div>
                <div className="bg-[#0A0A14] rounded-full h-2 mb-1.5">
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(p.impressions / maxImp) * 100}%`, backgroundColor: p.color }} />
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{p.note}</p>
              </div>
            ))}
          </div>

          {/* Honest strategy callout */}
          <div className="mt-5 p-3 bg-yellow-400/5 border border-yellow-400/15 rounded-xl">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-yellow-400 font-bold">🎯 The play:</span>{" "}
              Average position ~78 is page 8 — completely normal for a domain this young.
              Impressions are flowing to image-to-text and image-resizer; as the domain gains
              authority (guest posts + directory links in motion), these climb first. The new
              PDF articles target tools already in your usage top 10 — content/demand alignment is right.
            </p>
          </div>
        </div>
      </div>

      {/* ── Action cards — current real tasks ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon:"📤", title:"Submit 7 URLs for indexing", desc:"4 new June articles + 3 renamed slugs. URL Inspection → Request Indexing for each. Your #1 pending task.", link:"https://search.google.com/search-console", cta:"Open GSC" },
          { icon:"⚡", title:"Check Core Web Vitals",      desc:"The one unchecked medium-priority item. Target 90+ mobile before the AdSense window.", link:"https://pagespeed.web.dev", cta:"Test Speed" },
          { icon:"🔗", title:"Link building (ongoing)",    desc:"Guest posts + directory submissions continue through June. No on-site changes until after AdSense.", link:"https://search.google.com/search-console", cta:"Track" },
        ].map((card) => (
          <div key={card.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 sm:p-5">
            <div className="text-2xl mb-2">{card.icon}</div>
            <h3 className="font-bold text-white text-sm mb-1">{card.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{card.desc}</p>
            <a href={card.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#6C3AFF] hover:text-[#00D4FF] font-bold transition-colors">
              {card.cta} →
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
