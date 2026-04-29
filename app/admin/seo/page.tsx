"use client";

import { useState } from "react";

const SEO_CHECKS = [
  { label:"Sitemap submitted to Google",      done:false, priority:"high",   link:"https://search.google.com/search-console" },
  { label:"Google Search Console verified",  done:false, priority:"high",   link:"https://search.google.com/search-console" },
  { label:"All tools have meta titles",       done:true,  priority:"high",   link:null },
  { label:"All tools have meta descriptions", done:true,  priority:"high",   link:null },
  { label:"Schema markup on tool pages",      done:true,  priority:"medium", link:null },
  { label:"robots.txt file exists",           done:false, priority:"medium", link:null },
  { label:"Core Web Vitals passing",          done:false, priority:"medium", link:"https://pagespeed.web.dev" },
  { label:"Mobile friendly (all pages)",      done:true,  priority:"low",    link:null },
  { label:"SSL certificate active",           done:true,  priority:"high",   link:null },
  { label:"Internal linking structure set up",done:true,  priority:"medium", link:null },
  { label:"Open Graph tags on all pages",     done:true,  priority:"low",    link:null },
  { label:"Image alt tags filled",            done:false, priority:"low",    link:null },
];

const TOP_KEYWORDS = [
  { keyword:"json formatter online",     position:"-",  volume:"90K", difficulty:"medium", status:"not ranked" },
  { keyword:"free password generator",   position:"-",  volume:"74K", difficulty:"medium", status:"not ranked" },
  { keyword:"word counter online",       position:"-",  volume:"60K", difficulty:"low",    status:"not ranked" },
  { keyword:"qr code generator free",    position:"-",  volume:"110K",difficulty:"high",   status:"not ranked" },
  { keyword:"color picker online",       position:"-",  volume:"40K", difficulty:"low",    status:"not ranked" },
  { keyword:"purstech",                  position:"1",  volume:"<100",difficulty:"none",   status:"ranking"    },
];

const PRIORITY_COLORS: Record<string, string> = {
  high:   "text-red-400 bg-red-400/10 border-red-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  low:    "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export default function AdminSEOPage() {
  const [checks, setChecks] = useState(SEO_CHECKS);

  const toggle = (i: number) => setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, done: !c.done } : c));

  const doneCount   = checks.filter(c => c.done).length;
  const totalCount  = checks.length;
  const healthScore = Math.round((doneCount / totalCount) * 100);
  const healthColor = healthScore >= 80 ? "text-green-400" : healthScore >= 50 ? "text-yellow-400" : "text-red-400";
  const barColor    = healthScore >= 80 ? "bg-green-500" : healthScore >= 50 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-white">SEO Control Panel</h1>
        <p className="text-gray-500 text-sm mt-0.5">Monitor your site health and Google ranking progress.</p>
      </div>

      {/* ── Health score ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Overall SEO Health</h2>
            <p className="text-xs text-gray-500 mt-0.5">{doneCount} of {totalCount} checks passing</p>
          </div>
          <div className={`text-4xl font-extrabold ${healthColor}`}>{healthScore}<span className="text-2xl">/100</span></div>
        </div>
        <div className="bg-[#0A0A14] rounded-full h-3">
          <div className={`${barColor} h-3 rounded-full transition-all duration-500`} style={{ width:`${healthScore}%` }} />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {healthScore < 50 ? "🔴 Critical issues need fixing immediately." : healthScore < 80 ? "🟡 Good progress — a few items left." : "🟢 Excellent SEO health!"}
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Pages Indexed",    value:"—",    sub:"Submit sitemap first", color:"text-gray-400" },
          { label:"Tools with SEO",   value:"5/5",  sub:"100% complete",        color:"text-green-400"},
          { label:"Blog Posts",       value:"3",    sub:"Published",            color:"text-cyan-400" },
          { label:"Keywords Tracked", value:"6",    sub:"None ranking yet",     color:"text-violet-400"},
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

        {/* SEO checklist */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">✅ SEO Checklist</h2>
          <div className="space-y-2">
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

        {/* Keyword tracker */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">🔑 Keyword Tracker</h2>
          <p className="text-xs text-gray-500 mb-4">Your site is new — rankings appear after Google indexes your pages (4–8 weeks).</p>
          <div className="space-y-3">
            {TOP_KEYWORDS.map((kw) => (
              <div key={kw.keyword} className="bg-[#0A0A14] rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{kw.keyword}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-600">Vol: <span className="text-gray-400">{kw.volume}</span></span>
                      <span className="text-[10px] text-gray-600">Difficulty: <span className={
                        kw.difficulty === "none" ? "text-green-400" :
                        kw.difficulty === "low" ? "text-green-400" :
                        kw.difficulty === "medium" ? "text-yellow-400" : "text-red-400"
                      }>{kw.difficulty}</span></span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-extrabold ${kw.position === "-" ? "text-gray-600" : "text-green-400"}`}>
                      {kw.position === "-" ? "—" : `#${kw.position}`}
                    </div>
                    <div className={`text-[10px] ${kw.status === "ranking" ? "text-green-400" : "text-gray-600"}`}>
                      {kw.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-xl">
            <p className="text-xs text-gray-400">
              <span className="text-[#6C3AFF] font-bold">Next step:</span> Submit your sitemap to Google Search Console at{" "}
              <a href="https://search.google.com/search-console" target="_blank" className="text-[#00D4FF] hover:underline">
                search.google.com/search-console
              </a>
              {" "}to start getting indexed.
            </p>
          </div>
        </div>
      </div>

      {/* ── Action cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon:"🗺️", title:"Submit Sitemap",     desc:"Submit purstech.com/sitemap.xml to Google Search Console to get indexed faster.",  link:"https://search.google.com/search-console", cta:"Open Search Console" },
          { icon:"⚡", title:"Check Page Speed",   desc:"Run a PageSpeed Insights test. Target 90+ on mobile and desktop for best rankings.", link:"https://pagespeed.web.dev", cta:"Test Speed"          },
          { icon:"📱", title:"Mobile Friendly Test",desc:"Verify Google sees your site as mobile friendly — critical for ranking in 2025.",   link:"https://search.google.com/test/mobile-friendly", cta:"Run Test" },
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
