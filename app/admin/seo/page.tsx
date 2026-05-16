"use client";

import { useState } from "react";

// ── SEO Checklist — updated to reflect actual current state ──────────────────
// Last updated: May 2026

const SEO_CHECKS = [
  // ── High priority ──────────────────────────────────────────────────────────
  { label:"Sitemap submitted to Google Search Console",  done:true,  priority:"high",   link:null },
  { label:"Google Search Console verified",              done:true,  priority:"high",   link:"https://search.google.com/search-console" },
  { label:"All 50 tools have meta titles (≤60 chars)",   done:true,  priority:"high",   link:null },
  { label:"All 50 tools have meta descriptions",         done:true,  priority:"high",   link:null },
  { label:"SSL certificate active (www.purstech.com)",   done:true,  priority:"high",   link:null },
  { label:"Canonical tags correct on all pages",         done:true,  priority:"high",   link:null },
  { label:"301 redirect: purstech.com → www.purstech.com",done:true, priority:"high",   link:null },
  // ── Medium priority ────────────────────────────────────────────────────────
  { label:"robots.ts file with AI crawlers allowed",     done:true,  priority:"medium", link:null },
  { label:"JSON-LD schema on all tool pages",            done:true,  priority:"medium", link:null },
  { label:"WebSite + Organization schema in layout",     done:true,  priority:"medium", link:null },
  { label:"ItemList schema (all 50 tools) in layout",    done:true,  priority:"medium", link:null },
  { label:"Sitemap submitted to Bing Webmaster",         done:true,  priority:"medium", link:"https://www.bing.com/webmasters" },
  { label:"Bing IndexNow key deployed + 76 URLs pinged", done:true,  priority:"medium", link:null },
  { label:"llms.txt published (AI assistant discovery)", done:true,  priority:"medium", link:null },
  { label:"Open Graph tags on all pages",                done:true,  priority:"medium", link:null },
  { label:"Internal linking structure set up",           done:true,  priority:"medium", link:null },
  { label:"Mobile friendly (all pages)",                 done:true,  priority:"medium", link:null },
  { label:"Core Web Vitals passing",                     done:false, priority:"medium", link:"https://pagespeed.web.dev" },
  // ── Low priority ───────────────────────────────────────────────────────────
  { label:"Image alt tags on all tool screenshots",      done:false, priority:"low",    link:null },
  { label:"Hreflang for international versions",         done:false, priority:"low",    link:null },
];

// ── Keywords — updated with real Google Search Console data (May 2026) ────────
const TOP_KEYWORDS = [
  { keyword:"unit converter",          position:"1",  volume:"300K", difficulty:"medium", status:"#1 🏆"        },
  { keyword:"bmi calculator",          position:"2",  volume:"480K", difficulty:"medium", status:"#2 🔥"        },
  { keyword:"meta tag generator",      position:"3",  volume:"40K",  difficulty:"medium", status:"#3 🔥"        },
  { keyword:"image to text converter", position:"6",  volume:"200K", difficulty:"high",   status:"Page 1 ✨"    },
  { keyword:"image resizer online",    position:"79", volume:"120K", difficulty:"high",   status:"Improving"    },
  { keyword:"json formatter online",   position:"—",  volume:"90K",  difficulty:"medium", status:"Not ranked"   },
  { keyword:"free password generator", position:"—",  volume:"74K",  difficulty:"medium", status:"Not ranked"   },
  { keyword:"purstech",                position:"1",  volume:"—",    difficulty:"none",   status:"#1 (branded)" },
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

  const rankingCount = TOP_KEYWORDS.filter(k => k.position !== "—").length;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-white">SEO Control Panel</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Monitor your site health and Google ranking progress.
          <span className="text-xs text-gray-600 ml-2">Checklist updated May 2026</span>
        </p>
      </div>

      {/* ── Health score ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Overall SEO Health</h2>
            <p className="text-xs text-gray-500 mt-0.5">{doneCount} of {totalCount} checks passing</p>
          </div>
          <div className={`text-4xl font-extrabold ${healthColor}`}>
            {healthScore}<span className="text-2xl">/100</span>
          </div>
        </div>
        <div className="bg-[#0A0A14] rounded-full h-3">
          <div className={`${barColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${healthScore}%` }} />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {healthScore >= 80
            ? "🟢 Excellent — foundation is solid. Focus on content and link building now."
            : healthScore >= 50
            ? "🟡 Good progress — a few items left."
            : "🔴 Critical issues need fixing immediately."}
        </p>
      </div>

      {/* ── Stat cards — real data ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Pages Indexed",     value:"40",            sub:"Google (www consolidating)", color:"text-green-400"  },
          { label:"Tools with SEO",    value:"50/50",         sub:"All 50 tools optimised",     color:"text-cyan-400"   },
          { label:"Blog Posts Live",   value:"10",            sub:"All published",              color:"text-violet-400" },
          { label:"Keywords on Page 1",value:`${rankingCount}`, sub:"unit, bmi, meta, OCR",    color:"text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            <div className="text-[10px] text-gray-700 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SEO Checklist */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
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

        {/* Keyword Tracker */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">🔑 Keyword Tracker</h2>
          <p className="text-xs text-gray-500 mb-4">
            Real data from Google Search Console · {rankingCount} keywords ranking
          </p>
          <div className="space-y-2.5">
            {TOP_KEYWORDS.map((kw) => (
              <div key={kw.keyword} className="bg-[#0A0A14] rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{kw.keyword}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-600">
                        Vol: <span className="text-gray-400">{kw.volume}</span>
                      </span>
                      <span className="text-[10px] text-gray-600">
                        Difficulty:{" "}
                        <span className={
                          kw.difficulty === "none" ? "text-green-400" :
                          kw.difficulty === "low"  ? "text-green-400" :
                          kw.difficulty === "medium" ? "text-yellow-400" : "text-red-400"
                        }>{kw.difficulty}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-extrabold ${
                      kw.position === "1" ? "text-yellow-400" :
                      kw.position === "—" ? "text-gray-600" : "text-green-400"
                    }`}>
                      {kw.position === "—" ? "—" : `#${kw.position}`}
                    </div>
                    <div className="text-[10px] text-gray-500">{kw.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Big opportunity callout */}
          <div className="mt-4 p-3 bg-yellow-400/5 border border-yellow-400/15 rounded-xl">
            <p className="text-xs text-gray-400">
              <span className="text-yellow-400 font-bold">🎯 Big opportunity:</span>{" "}
              image-to-text has 200K monthly searches and you&apos;re already on page 1 at #6.
              Improve the page content to push it to #1–3 for hundreds of daily clicks.
            </p>
          </div>
        </div>
      </div>

      {/* ── Action cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon:"⚡", title:"Check Page Speed",    desc:"Run PageSpeed Insights. Target 90+ on mobile and desktop.",    link:"https://pagespeed.web.dev",                          cta:"Test Speed"   },
          { icon:"📱", title:"Mobile Friendly Test", desc:"Verify Google sees your site as mobile friendly.",             link:"https://search.google.com/test/mobile-friendly",     cta:"Run Test"     },
          { icon:"🔍", title:"Google Search Console",desc:"Request indexing for Batch 8+9 tool pages. 10 pages waiting.", link:"https://search.google.com/search-console",           cta:"Open GSC"     },
        ].map((card) => (
          <div key={card.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
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
