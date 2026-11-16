"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool";

interface CheckItem {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  fix?: string;
  detailList?: string[];
}

interface AuditCategory {
  name: string;
  group: "hard" | "soft";
  score: number;
  maxScore: number;
  items: CheckItem[];
}

interface PageAudit {
  url: string;
  path: string;
  title: string;
  pageType: "homepage" | "required" | "listing" | "tool_detail" | "article" | "utility";
  pageLanguage: string;
  totalChars: number;
  contentChars: number;
  wordCount: number;
  contentRatio: number;
  h1Count: number;
  h2Count: number;
  schemaCount: number;
  detailsCount: number;
  vot: { V: number; O: number; T: number; C: number; R: number };
  contentStatus: "pass" | "warn" | "fail";
  issues: string[];
  score: number;
}

interface AuditResponse {
  url: string;
  timestamp: string;
  lang: string;
  siteType: string;
  siteTypeConfidence: string;
  samplingInfo: { pagesAnalyzed: number; totalDiscovered: number; confidence: string };
  compositeScore: number;
  siteQuality: number;
  homeQuality: number;
  pageValueScore: number;
  hardStatus: "ready" | "needs_fixes";
  hardScore: number;
  totalChecks: number;
  passed: number;
  warned: number;
  failed: number;
  approvalEstimate: { probability: number; confidence: string; keyFactors: string[] };
  publisherSignals: {
    isHttps: boolean;
    hasAdsTxt: boolean;
    detectedPubId: string | null;
    hasAdsenseScript: boolean;
    hasAdsenseMeta: boolean;
    hasConsentMode: boolean;
    explicitMediapartners: boolean;
    hasLlmsTxt: boolean;
    schemaCount: number;
    detailsFaqCount: number;
    loadTimeSec: number;
  };
  categories: AuditCategory[];
  pages: PageAudit[];
}

interface HistoryEntry {
  url: string;
  score: number;
  probability: number;
  hardStatus: string;
  timestamp: string;
}

const POPULAR_DOMAINS = ["purstech.com", "github.com", "vercel.com", "cloudflare.com", "mozilla.org"];

const NICHES: Record<string, { label: string; baseRpm: number; avgCpc: number; avgCtr: number }> = {
  finance:   { label: "Finance, Loans & Investing",     baseRpm: 18.5, avgCpc: 1.45, avgCtr: 1.28 },
  saas:      { label: "Developer, Cloud & SaaS Tools",  baseRpm: 12.0, avgCpc: 0.95, avgCtr: 1.26 },
  seo:       { label: "SEO, Webmaster & Marketing",     baseRpm: 13.5, avgCpc: 1.10, avgCtr: 1.22 },
  ai:        { label: "AI, Writing & Document Tools",   baseRpm: 10.5, avgCpc: 0.82, avgCtr: 1.28 },
  education: { label: "Education, Math & Reference",    baseRpm: 7.2,  avgCpc: 0.55, avgCtr: 1.30 },
  utilities: { label: "General Online Converters",      baseRpm: 6.5,  avgCpc: 0.48, avgCtr: 1.35 },
};

const GEO_TIERS: Record<string, { label: string; multiplier: number }> = {
  tier1: { label: "Tier 1 (US, UK, Canada, Australia, Germany)", multiplier: 1.35 },
  mixed: { label: "Balanced Global Mix (US/EU + Asia/LATAM)",    multiplier: 0.85 },
  tier3: { label: "Emerging Markets (South Asia, MENA, LATAM)",  multiplier: 0.35 },
};

const FAQ = [
  {
    q: "How does the 26-point Google AdSense Readiness Score work?",
    a: "Our auditor evaluates 26 technical and editorial signals across 7 weighted categories totaling 2,600 points: Site Scale (100 pts), Required Pages (400 pts), Site Structure (300 pts), Policy Compliance (100 pts), Content Quality (600 pts), Landing Page Quality (600 pts), and User Experience (500 pts). It then computes your Composite Score using the formula: Page Value × (Site-wide Quality / 100) × (Landing Page Quality / 100).",
  },
  {
    q: "Why did Google AdSense reject my site for 'Low value content'?",
    a: "'Low value content' (and 'Ads on screens without publisher content') is Google AdSense's #1 rejection reason. It occurs when pages have thin server-rendered prose (<300–500 words), rely purely on client-side JavaScript state that crawlers do not expand, share high template similarity across subpages, or lack mandatory trust pages (/about, /privacy, /contact, /terms). Expanding tool and article pages with 500–800+ words of original technical guides and native HTML5 <details> FAQs resolves this issue.",
  },
  {
    q: "Why does AdSense show 'Ads.txt status: Not found' even after I uploaded ads.txt?",
    a: "First, verify that both https://yourdomain.com/ads.txt and https://www.yourdomain.com/ads.txt resolve with HTTP 200 OK and text/plain headers via a 301/308 permanent redirect, and that robots.txt allows Mediapartners-Google. Second, check the 'Last updated' timestamp in your AdSense Sites table: while a site is in 'Needs attention' status, AdSense pauses background ads.txt crawls until you check 'I confirm I have fixed the issues' and click Request review.",
  },
  {
    q: "What do the 5 V-O-T-C-R dimensions mean in the page audit?",
    a: "Each sampled page is graded from 0 to 10 across five dimensions: Value (V — substantive depth and utility of server-rendered text), Originality (O — unique domain prose, structured tables, and absence of placeholder filler), Translation/Language (T — clean language declaration in <html lang> without machine-translation artifacts), Compliance (C — absence of restricted AdSense policy keywords), and Relevance (R — topical alignment with the site's primary theme).",
  },
  {
    q: "How can a web tool, calculator, or SaaS utility site get approved for Google AdSense?",
    a: "Interactive tool sites are frequently rejected if each tool route only renders input fields and buttons. To pass AdSense review, every tool URL must pair its interactive widget with 1,500–3,000+ characters (500+ words) of server-rendered educational content: how the underlying algorithm works, step-by-step usage instructions, a reference comparison table, and 4–6 native <details>/<summary> FAQs, alongside 15–20+ long-form blog tutorials linking to those tools.",
  },
  {
    q: "What score should I reach before clicking 'Request review' in Google AdSense?",
    a: "Aim for a Composite Score of 80/100 or higher and a Hard Status of 'READY' (meaning all 900/900 points in Site Scale, Required Pages, Site Structure, and Policy Compliance pass with zero failures). Sites scoring 85–95+ with 100% hard-requirement compliance have the highest first-pass approval rate.",
  },
  {
    q: "Does this AdSense checker store my website URL or audit data?",
    a: "No. Live audits are fetched on the fly to compute your 26-point report and returned directly to your browser. Recent scan history is stored exclusively in your own browser's localStorage so you can track improvements across deployments, and can be cleared with one click.",
  },
  {
    q: "Is PursTech's Google AdSense Eligibility Checker affiliated with Google LLC?",
    a: "No. This tool is an independent technical auditing utility engineered from publicly documented Google Publisher Policies, Google Search Central Helpful Content guidelines, and IAB Tech Lab ads.txt specifications. Only Google LLC makes final AdSense approval decisions.",
  },
];

export default function AdsenseCheckerClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("adsense-checker", "seo");

  const [activeTab, setActiveTab] = useState<"audit" | "draft" | "generator" | "calculator">("audit");

  // Tab 1: Live Audit state
  const [urlInput, setUrlInput] = useState("purstech.com");
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [error, setError] = useState("");
  const [report, setReport] = useState<AuditResponse | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Tab 2: Low Value Content Draft Analyzer state
  const [draftText, setDraftText] = useState(
    `<h1>How Compound Interest & Amortization Schedules Work</h1>\n<p>Compound interest accelerates wealth generation by reinvesting earned interest back into the principal balance at regular compounding intervals (daily, monthly, quarterly, or annually). Unlike simple linear interest, exponential compounding calculates each period's yield on the sum of the initial deposit plus all previously accumulated interest.</p>\n<h2>Mathematical Formula & Effective Annual Yield (APY)</h2>\n<p>The standard compound interest equation is A = P(1 + r/n)^(nt), where P represents starting principal, r represents nominal annual interest rate, n represents compounding frequency per year, and t represents total time in years. When regular monthly contributions (PMT) are added, future value grows through a geometric series.</p>\n<details><summary>Why does monthly compounding beat annual compounding?</summary><p>Because interest is credited 12 times per year instead of once, each month's interest immediately begins earning interest in the following month, resulting in a higher Effective Annual Rate (APY).</p></details>`
  );

  // Tab 3: ads.txt & Consent Mode Generator state
  const [pubId, setPubId] = useState("pub-6963502356186067");
  const [domainForGen, setDomainForGen] = useState("www.purstech.com");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Tab 4: Revenue Calculator state
  const [niche, setNiche] = useState("seo");
  const [geo, setGeo] = useState("tier1");
  const [monthlyViews, setMonthlyViews] = useState(50000);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pt_adsense_audit_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const runLiveAudit = async (targetDomain?: string) => {
    const target = (targetDomain ?? urlInput).trim();
    if (!target) return;
    setUrlInput(target);
    setLoading(true);
    setError("");
    setScanStep("Connecting to host & inspecting HTTPS, H1, and DOM structure...");

    const timers = [
      setTimeout(() => setScanStep("Checking /robots.txt, /ads.txt, and /sitemap.xml..."), 1100),
      setTimeout(() => setScanStep("Verifying /about, /privacy, /contact, and /terms trust pages..."), 2300),
      setTimeout(() => setScanStep("Sampling subpages for Content Ratio (%) & 5-Dimension V-O-T-C-R scoring..."), 3500),
    ];

    try {
      const res = await fetch(`/api/adsense-check?url=${encodeURIComponent(target)}`);
      const data = await res.json();
      timers.forEach(clearTimeout);
      if (!res.ok || data.error) {
        setError(data.error || "Audit failed. Please check the URL and try again.");
      } else {
        setReport(data);
        if (data.publisherSignals?.detectedPubId) {
          setPubId(data.publisherSignals.detectedPubId);
        }
        const entry: HistoryEntry = {
          url: data.url,
          score: data.compositeScore,
          probability: data.approvalEstimate.probability,
          hardStatus: data.hardStatus,
          timestamp: data.timestamp,
        };
        const updated = [entry, ...history.filter((h) => h.url !== data.url)].slice(0, 6);
        setHistory(updated);
        try {
          localStorage.setItem("pt_adsense_audit_history", JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
    } catch {
      timers.forEach(clearTimeout);
      setError("Network error while running audit. Please check your connection and try again.");
    }
    setLoading(false);
    setScanStep("");
  };

  // Generate Markdown report matching Report.pdf format
  const buildMarkdownReport = (r: AuditResponse): string => {
    const lines: string[] = [
      `# AdSense Review Report`,
      ``,
      `| Item | Value |`,
      `|------|-------|`,
      `| URL | ${r.url} |`,
      `| Time | ${r.timestamp} |`,
      `| Site Type | Tool / Content Site (${r.siteTypeConfidence}) |`,
      `| Pages Analyzed | ${r.samplingInfo.pagesAnalyzed} sampled (${r.samplingInfo.totalDiscovered} discovered), ${r.samplingInfo.confidence} confidence |`,
      ``,
      `## Conclusion`,
      `**Overall Score**: ${r.compositeScore}/100`,
      ``,
      `| Metric | Score |`,
      `|--------|-------|`,
      `| Site-wide Quality | ${r.siteQuality}/100 |`,
      `| Landing Page Quality | ${r.homeQuality}/100 |`,
      `| Page Value | ${r.pageValueScore}/100 |`,
      ``,
      `> ${r.pageValueScore} × ${r.siteQuality}/100 × ${r.homeQuality}/100 = ${r.compositeScore}`,
      ``,
      `## Approval Probability Estimation`,
      `- **Approval Probability**: ${r.approvalEstimate.probability}% (${r.approvalEstimate.confidence})`,
      `- **Hard Requirements Status**: ${r.hardStatus.toUpperCase()} (${r.hardScore}/900 pts)`,
      `- **Key Factors**:`,
      ...r.approvalEstimate.keyFactors.map((f) => `  - ${f}`),
      ``,
      `## 26-Point Category Breakdown (${r.siteQuality}/100)`,
    ];
    for (const cat of r.categories) {
      lines.push(``, `### ${cat.name} (${cat.score}/${cat.maxScore} pts — ${cat.group.toUpperCase()})`);
      for (const item of cat.items) {
        const icon = item.status === "pass" ? "✅" : item.status === "warn" ? "⚠️" : "❌";
        lines.push(`- ${icon} **${item.name}**: ${item.message}`);
        if (item.fix) lines.push(`  - *Fix*: ${item.fix}`);
      }
    }
    lines.push(
      ``,
      `## Sampled Pages Breakdown (${r.pages.length} pages)`,
      ``,
      `| Status | Path | Content Ratio | Content Chars | Words | V | O | T | C | R | Score | Title |`,
      `|--------|------|---------------|---------------|-------|---|---|---|---|---|-------|-------|`
    );
    for (const p of r.pages) {
      const icon = p.contentStatus === "pass" ? "✅" : p.contentStatus === "warn" ? "⚠️" : "❌";
      lines.push(
        `| ${icon} | \`${p.path}\` | ${p.contentRatio}% | ${p.contentChars} | ${p.wordCount} | ${p.vot.V} | ${p.vot.O} | ${p.vot.T} | ${p.vot.C} | ${p.vot.R} | ${p.score}/100 | ${p.title.replace(/\|/g, "—")} |`
      );
    }
    return lines.join("\n");
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(u);
  };

  // Tab 2: Analyze draft text/HTML
  const analyzeDraft = () => {
    const raw = draftText || "";
    const stripped = raw
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = stripped.split(/\s+/).filter((w) => w.length > 1);
    const wordCount = words.length;
    const charCount = stripped.length;
    const totalRaw = Math.max(raw.length, 1);
    const contentRatio = Math.min(100, Math.round((charCount / totalRaw) * 100));
    const h1s = (raw.match(/<h1[\s>]|^#\s/gim) || []).length;
    const h2s = (raw.match(/<h2[\s>]|^##\s/gim) || []).length;
    const hasFaq = /<details|<summary|frequently asked questions/i.test(raw);
    const hasTable = /<table|\|---/i.test(raw);
    const restricted = stripped.match(/\b(porn|xxx|casino|gambling|warez|keygen|cracked|pirated|darknet)\b/gi) || [];

    const V = wordCount >= 600 ? 10 : wordCount >= 400 ? 9 : wordCount >= 250 ? 7 : wordCount >= 120 ? 5 : 3;
    const O = hasFaq && hasTable ? 10 : hasFaq || h2s >= 2 ? 9 : 7;
    const T = 10;
    const C = restricted.length === 0 ? 10 : 4;
    const R = 9;
    const draftScore = Math.min(100, Math.round(((V + O + T + C + R) / 50) * 100));

    return { wordCount, charCount, contentRatio, h1s, h2s, hasFaq, hasTable, restricted: [...new Set(restricted)], V, O, T, C, R, draftScore };
  };

  const draftStats = analyzeDraft();

  // Tab 3: Generated snippets
  const cleanPubId = pubId.trim().replace(/^ca-/i, "").startsWith("pub-")
    ? pubId.trim().replace(/^ca-/i, "")
    : `pub-${pubId.trim().replace(/\D/g, "") || "0000000000000000"}`;

  const adsTxtSnippet = `google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0`;
  const robotsSnippet = `User-agent: Mediapartners-Google
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: AdsBot-Google-Mobile
Allow: /

User-agent: Google-Display-Ads-Bot
Allow: /

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://${domainForGen.replace(/^https?:\/\//, "")}/sitemap.xml`;

  const headSnippet = `<!-- 1. Google Consent Mode v2 (EEA/UK/CH GDPR Compliant) -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH'],
    'wait_for_update': 500
  });
  gtag('consent', 'default', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
</script>

<!-- 2. Google AdSense Account Meta Verification -->
<meta name="google-adsense-account" content="ca-${cleanPubId}">

<!-- 3. Google AdSense Script -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${cleanPubId}" crossorigin="anonymous"></script>`;

  // Tab 4: Revenue calculation
  const selectedNiche = NICHES[niche] || NICHES.seo;
  const selectedGeo = GEO_TIERS[geo] || GEO_TIERS.tier1;
  const effectiveRpm = Number((selectedNiche.baseRpm * selectedGeo.multiplier).toFixed(2));
  const effectiveCpc = Number((selectedNiche.avgCpc * selectedGeo.multiplier).toFixed(2));
  const monthlyRevenue = Math.round((monthlyViews / 1000) * effectiveRpm);
  const annualRevenue = monthlyRevenue * 12;
  const monthlyClicks = Math.round(monthlyViews * (selectedNiche.avgCtr / 100));

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden w-full">
      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 h-16 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40 flex items-center w-full">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight flex-shrink-0">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/tools" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">All Tools</Link>
            <Link href="/blog" className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">Blog</Link>
            <Link href="/about" className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">About</Link>
            <Link href="/contact" className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">Contact</Link>
            <Link href="/blog" className="px-3.5 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all flex-shrink-0">
              Guides 📖
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full min-w-0">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span aria-hidden="true">›</span>
          <Link href="/categories/seo" className="hover:text-gray-400 transition-colors">SEO Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">AdSense Readiness Checker</span>
        </nav>

        {/* Server-rendered Hero */}
        {children}

        {/* 4-Mode Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#13131F] p-1.5 rounded-2xl border border-white/5 mb-8">
          {[
            { id: "audit",      label: "🌐 26-Point Site Audit",   sub: "Live Domain & Sitemap Scan" },
            { id: "draft",      label: "📝 Low Value Analyzer",    sub: "Audit Page Text / HTML" },
            { id: "generator",  label: "🛡️ ads.txt & Consent Gen", sub: "Fix Not Found & Robots" },
            { id: "calculator", label: "💰 Revenue & RPM Calc",    sub: "Estimate AdSense Earnings" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-3 py-3 rounded-xl text-left transition-all ${
                activeTab === t.id
                  ? "bg-[#6C3AFF] text-white shadow-lg shadow-[#6C3AFF]/25"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <div className="text-xs font-extrabold truncate">{t.label}</div>
              <div className={`text-[11px] truncate mt-0.5 ${activeTab === t.id ? "text-white/80" : "text-gray-500"}`}>
                {t.sub}
              </div>
            </button>
          ))}
        </div>

        {/* ── TAB 1: 26-POINT LIVE SITE AUDIT ── */}
        {activeTab === "audit" && (
          <div className="space-y-6 min-w-0 w-full">
            <div className="bg-[#13131F] border border-white/10 rounded-2xl p-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Enter Website URL or Domain to Audit (26 Checks • 2,600 Points)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runLiveAudit()}
                  placeholder="e.g. purstech.com or https://www.example.com"
                  className="flex-grow bg-[#0A0A14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]"
                />
                <button
                  onClick={() => runLiveAudit()}
                  disabled={loading}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-95 text-white font-extrabold text-sm transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {loading ? "Scanning Site..." : "Run 26-Point Audit →"}
                </button>
              </div>

              {/* Quick Test Presets */}
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="text-xs text-gray-500">Quick test:</span>
                {POPULAR_DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => runLiveAudit(d)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#6C3AFF]/20 text-gray-300 hover:text-white border border-white/5 transition-all"
                  >
                    {d}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="mt-5 bg-[#0A0A14] border border-[#6C3AFF]/30 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div className="text-xs text-gray-300 font-medium">{scanStep}</div>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-300">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Recent Scan History */}
            {history.length > 0 && !loading && (
              <div className="flex items-center justify-between gap-2 flex-wrap bg-[#13131F]/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 font-semibold">Recent Audits:</span>
                  {history.map((h) => (
                    <button
                      key={h.url}
                      onClick={() => runLiveAudit(h.url)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1.5"
                    >
                      <span>{h.url.replace(/^https?:\/\//, "")}</span>
                      <span className={h.score >= 80 ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
                        {h.score}/100
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem("pt_adsense_audit_history");
                  }}
                  className="text-gray-600 hover:text-gray-400"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Live Audit Results */}
            {report && (
              <div className="space-y-6">
                {/* Top Summary Scorecard */}
                <div className="bg-[#13131F] border border-white/10 rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#6C3AFF]/20 text-[#00D4FF] border border-[#6C3AFF]/30">
                          {report.url}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            report.hardStatus === "ready"
                              ? "bg-green-500/15 text-green-400 border border-green-500/30"
                              : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {report.hardStatus === "ready" ? "✔ HARD REQUIREMENTS: READY" : "⚠ HARD REQUIREMENTS: NEEDS FIXES"}
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-white">
                        Composite AdSense Readiness Score: {report.compositeScore}/100
                      </h2>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        Formula: Page Value ({report.pageValueScore}) × Site-wide Quality ({report.siteQuality}/100) × Landing Page ({report.homeQuality}/100) ={" "}
                        <strong className="text-white">{report.compositeScore}</strong>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {report.approvalEstimate.keyFactors.map((kf, i) => (
                          <span key={i} className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-gray-300">
                            • {kf}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-stretch md:self-auto bg-[#0A0A14] border border-white/10 rounded-2xl p-4">
                      <div className="text-center px-2">
                        <div
                          className={`text-4xl font-black ${
                            report.compositeScore >= 85
                              ? "text-green-400"
                              : report.compositeScore >= 70
                              ? "text-cyan-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {report.compositeScore}
                          <span className="text-base text-gray-500 font-normal">/100</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-semibold mt-1">Composite Score</div>
                      </div>
                      <div className="h-12 w-px bg-white/10" />
                      <div className="text-center px-2">
                        <div
                          className={`text-3xl font-black ${
                            report.approvalEstimate.probability >= 85
                              ? "text-green-400"
                              : report.approvalEstimate.probability >= 65
                              ? "text-cyan-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {report.approvalEstimate.probability}%
                        </div>
                        <div className="text-[11px] text-gray-400 font-semibold mt-1">
                          Approval Odds ({report.approvalEstimate.confidence})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Pillar Bar + Check Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-6">
                    <div className="bg-[#0A0A14] rounded-xl p-3 border border-white/5">
                      <div className="text-xs text-gray-400">Site-wide Quality</div>
                      <div className="text-lg font-extrabold text-white mt-0.5">{report.siteQuality}/100</div>
                    </div>
                    <div className="bg-[#0A0A14] rounded-xl p-3 border border-white/5">
                      <div className="text-xs text-gray-400">Landing Page</div>
                      <div className="text-lg font-extrabold text-white mt-0.5">{report.homeQuality}/100</div>
                    </div>
                    <div className="bg-[#0A0A14] rounded-xl p-3 border border-white/5">
                      <div className="text-xs text-gray-400">Page Value (VOT)</div>
                      <div className="text-lg font-extrabold text-white mt-0.5">{report.pageValueScore}/100</div>
                    </div>
                    <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
                      <div className="text-xs text-green-300">Passed Checks</div>
                      <div className="text-lg font-extrabold text-green-400 mt-0.5">
                        {report.passed}/{report.totalChecks}
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20">
                      <div className="text-xs text-yellow-300">Warnings</div>
                      <div className="text-lg font-extrabold text-yellow-400 mt-0.5">{report.warned}</div>
                    </div>
                    <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                      <div className="text-xs text-red-300">Failed Checks</div>
                      <div className="text-lg font-extrabold text-red-400 mt-0.5">{report.failed}</div>
                    </div>
                  </div>

                  {/* Publisher & AI Readiness Signals Strip */}
                  <div className="mt-6 pt-5 border-t border-white/5">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Live Publisher, Crawler &amp; AI Citation Signals Detected
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      {[
                        { label: "HTTPS Encryption", ok: report.publisherSignals.isHttps, val: report.publisherSignals.isHttps ? "Active" : "Missing" },
                        { label: "ads.txt Authorization", ok: report.publisherSignals.hasAdsTxt, val: report.publisherSignals.detectedPubId || (report.publisherSignals.hasAdsTxt ? "Verified" : "Not Found") },
                        { label: "Mediapartners-Google", ok: report.publisherSignals.explicitMediapartners, val: report.publisherSignals.explicitMediapartners ? "Explicit Allow" : "Default *" },
                        { label: "Google Consent Mode v2", ok: report.publisherSignals.hasConsentMode, val: report.publisherSignals.hasConsentMode ? "Detected" : "Not Detected" },
                        { label: "AdSense Script / Meta", ok: report.publisherSignals.hasAdsenseScript || report.publisherSignals.hasAdsenseMeta, val: report.publisherSignals.hasAdsenseScript ? "adsbygoogle.js Live" : "Not Installed" },
                        { label: "JSON-LD Schemas (Home)", ok: report.publisherSignals.schemaCount > 0, val: `${report.publisherSignals.schemaCount} Schema(s)` },
                        { label: "SSR <details> FAQs", ok: report.publisherSignals.detailsFaqCount > 0, val: `${report.publisherSignals.detailsFaqCount} Accordion(s)` },
                        { label: "llms.txt AI Discovery", ok: report.publisherSignals.hasLlmsTxt, val: report.publisherSignals.hasLlmsTxt ? "Found (/llms.txt)" : "Missing" },
                      ].map((sig) => (
                        <div key={sig.label} className="bg-[#0A0A14] border border-white/5 rounded-xl p-2.5 flex items-center justify-between gap-2">
                          <span className="text-gray-400 truncate">{sig.label}</span>
                          <span className={`font-bold flex-shrink-0 ${sig.ok ? "text-green-400" : "text-yellow-400"}`}>
                            {sig.ok ? "✔ " : "• "}
                            {sig.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-3">
                    <button
                      onClick={() => downloadFile(buildMarkdownReport(report), `adsense-report-${new Date().toISOString().slice(0, 10)}.md`, "text/markdown")}
                      className="px-4 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#5829E0] text-white text-xs font-bold transition-all"
                    >
                      ⬇ Download Markdown Report (.md)
                    </button>
                    <button
                      onClick={() => downloadFile(JSON.stringify(report, null, 2), `adsense-report-${new Date().toISOString().slice(0, 10)}.json`, "application/json")}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all"
                    >
                      ⬇ Download Raw JSON Report (.json)
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(buildMarkdownReport(report));
                        setCopiedReport(true);
                        setTimeout(() => setCopiedReport(false), 2000);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all"
                    >
                      {copiedReport ? "✔ Copied Report!" : "📋 Copy Full Report"}
                    </button>
                  </div>
                </div>

                {/* 7 Category Scorecards (2,600 Points Breakdown) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.categories.map((cat) => {
                    const pct = Math.round((cat.score / cat.maxScore) * 100);
                    return (
                      <div key={cat.name} className="bg-[#13131F] border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-white">{cat.name}</span>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                cat.group === "hard"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                              }`}
                            >
                              {cat.group}
                            </span>
                          </div>
                          <span className="text-sm font-extrabold text-white">
                            {cat.score} / {cat.maxScore} pts ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#0A0A14] rounded-full overflow-hidden mb-4">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 90 ? "bg-green-500" : pct >= 70 ? "bg-cyan-400" : "bg-yellow-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="space-y-2.5">
                          {cat.items.map((item) => (
                            <div key={item.name} className="bg-[#0A0A14] border border-white/5 rounded-xl p-3 text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-white">
                                  {item.status === "pass" ? "✅ " : item.status === "warn" ? "⚠️ " : "❌ "}
                                  {item.name}
                                </span>
                                <span className="text-gray-400 text-right">{item.message}</span>
                              </div>
                              {item.detailList && item.detailList.length > 0 && (
                                <div className="mt-2 text-yellow-300 font-mono bg-yellow-500/10 rounded-lg p-2">
                                  {item.detailList.join(", ")}
                                </div>
                              )}
                              {item.fix && (
                                <div className="mt-2 text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-lg p-2">
                                  <strong>How to Fix:</strong> {item.fix}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stratified Sampled Pages Table */}
                <div className="bg-[#13131F] border border-white/10 rounded-2xl p-6 overflow-x-auto">
                  <h3 className="text-lg font-extrabold text-white mb-1">
                    Sampled Pages Content Ratio &amp; 5-Dimension V-O-T-C-R Breakdown ({report.pages.length} Pages Analyzed)
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Measures visible editorial prose vs. HTML boilerplate (`contentRatio`), character depth (`contentChars`), and 5-dimension readiness (`Value`, `Originality`, `Translation`, `Compliance`, `Relevance`).
                  </p>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="py-2.5 pr-3">Status</th>
                        <th className="py-2.5 pr-3">Path</th>
                        <th className="py-2.5 pr-3">Type</th>
                        <th className="py-2.5 pr-3 text-right">Content Ratio</th>
                        <th className="py-2.5 pr-3 text-right">Content Chars</th>
                        <th className="py-2.5 pr-3 text-right">Words</th>
                        <th className="py-2.5 pr-3 text-center">V-O-T-C-R</th>
                        <th className="py-2.5 pr-3 text-right">Score</th>
                        <th className="py-2.5">Title &amp; Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.pages.map((p) => (
                        <tr key={p.url} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-2.5 pr-3">
                            {p.contentStatus === "pass" ? "✅" : p.contentStatus === "warn" ? "⚠️" : "❌"}
                          </td>
                          <td className="py-2.5 pr-3 font-mono text-[#00D4FF]">{p.path}</td>
                          <td className="py-2.5 pr-3 text-gray-400">{p.pageType}</td>
                          <td className="py-2.5 pr-3 text-right font-bold text-white">{p.contentRatio}%</td>
                          <td className="py-2.5 pr-3 text-right text-gray-300">{p.contentChars.toLocaleString()}</td>
                          <td className="py-2.5 pr-3 text-right text-gray-300">{p.wordCount.toLocaleString()}</td>
                          <td className="py-2.5 pr-3 text-center font-mono text-gray-300">
                            {p.vot.V}·{p.vot.O}·{p.vot.T}·{p.vot.C}·{p.vot.R}
                          </td>
                          <td className="py-2.5 pr-3 text-right font-bold text-green-400">{p.score}/100</td>
                          <td className="py-2.5 text-gray-300 max-w-xs truncate" title={p.title}>
                            <div>{p.title}</div>
                            {p.issues.length > 0 && (
                              <div className="text-[11px] text-yellow-400">{p.issues.join(" • ")}</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: LOW VALUE CONTENT DRAFT & HTML ANALYZER ── */}
        {activeTab === "draft" && (
          <div className="bg-[#13131F] border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white mb-1">
                Single-Page &ldquo;Low Value Content&rdquo; Draft &amp; HTML Analyzer
              </h2>
              <p className="text-xs text-gray-400">
                Paste any article draft, tool page JSX/HTML, or landing page copy below to test its content-to-code ratio, word depth, heading structure, and policy keyword safety before deploying.
              </p>
            </div>

            <textarea
              rows={9}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Paste your article text or HTML source code here..."
              className="w-full bg-[#0A0A14] border border-white/10 rounded-xl p-4 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#6C3AFF]"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400">Draft Readiness Score</div>
                <div className={`text-2xl font-black mt-1 ${draftStats.draftScore >= 85 ? "text-green-400" : "text-yellow-400"}`}>
                  {draftStats.draftScore}/100
                </div>
              </div>
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400">Clean Word Count</div>
                <div className="text-2xl font-black text-white mt-1">
                  {draftStats.wordCount} <span className="text-xs font-normal text-gray-500">words</span>
                </div>
              </div>
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400">Content-to-Code Ratio</div>
                <div className="text-2xl font-black text-[#00D4FF] mt-1">{draftStats.contentRatio}%</div>
              </div>
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400">V-O-T-C-R Dimensions</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {draftStats.V}·{draftStats.O}·{draftStats.T}·{draftStats.C}·{draftStats.R}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-3.5">
                <span className="font-bold text-white">Heading Landmarks: </span>
                <span className="text-gray-300">
                  {draftStats.h1s} H1, {draftStats.h2s} H2s {draftStats.h1s === 1 && draftStats.h2s >= 1 ? "✅" : "⚠️ (Add 1 H1 + 2+ H2s)"}
                </span>
              </div>
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-3.5">
                <span className="font-bold text-white">SSR FAQ / Table Signals: </span>
                <span className="text-gray-300">
                  {draftStats.hasFaq ? "✔ <details> FAQ " : "⚠️ No <details> FAQ "}
                  {draftStats.hasTable ? "✔ Table" : ""}
                </span>
              </div>
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-3.5">
                <span className="font-bold text-white">Policy Keyword Scan: </span>
                <span className={draftStats.restricted.length === 0 ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                  {draftStats.restricted.length === 0 ? "✔ 0 Restricted Words" : `⚠️ Flagged: ${draftStats.restricted.join(", ")}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: ADS.TXT, ROBOTS.TXT & CONSENT MODE V2 GENERATOR ── */}
        {activeTab === "generator" && (
          <div className="bg-[#13131F] border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white mb-1">
                Instant <code className="text-[#00D4FF]">ads.txt</code>, <code className="text-[#00D4FF]">robots.txt</code> &amp; Consent Mode v2 Generator
              </h2>
              <p className="text-xs text-gray-400">
                Eliminate the &ldquo;Ads.txt status: Not found&rdquo; warning and unblock <code className="text-gray-300">Mediapartners-Google</code> with copy-ready files.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Google AdSense Publisher ID</label>
                <input
                  type="text"
                  value={pubId}
                  onChange={(e) => setPubId(e.target.value)}
                  placeholder="pub-6963502356186067"
                  className="w-full bg-[#0A0A14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Canonical Domain</label>
                <input
                  type="text"
                  value={domainForGen}
                  onChange={(e) => setDomainForGen(e.target.value)}
                  placeholder="www.purstech.com"
                  className="w-full bg-[#0A0A14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono"
                />
              </div>
            </div>

            {/* 1. ads.txt */}
            <div className="bg-[#0A0A14] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white">1. Authorized Digital Sellers (/public/ads.txt)</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyText(adsTxtSnippet, "ads")}
                    className="px-3 py-1 rounded-lg bg-[#6C3AFF] text-white text-xs font-bold"
                  >
                    {copiedSnippet === "ads" ? "✔ Copied!" : "Copy ads.txt"}
                  </button>
                  <button
                    onClick={() => downloadFile(adsTxtSnippet + "\n", "ads.txt", "text/plain")}
                    className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold"
                  >
                    Download ads.txt
                  </button>
                </div>
              </div>
              <pre className="text-xs text-green-400 font-mono overflow-x-auto p-2 bg-black/40 rounded-lg">{adsTxtSnippet}</pre>
            </div>

            {/* 2. robots.txt */}
            <div className="bg-[#0A0A14] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white">2. AdSense-Safe /public/robots.txt (Unblocks Mediapartners-Google)</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyText(robotsSnippet, "robots")}
                    className="px-3 py-1 rounded-lg bg-[#6C3AFF] text-white text-xs font-bold"
                  >
                    {copiedSnippet === "robots" ? "✔ Copied!" : "Copy robots.txt"}
                  </button>
                  <button
                    onClick={() => downloadFile(robotsSnippet + "\n", "robots.txt", "text/plain")}
                    className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold"
                  >
                    Download robots.txt
                  </button>
                </div>
              </div>
              <pre className="text-xs text-cyan-300 font-mono overflow-x-auto p-2 bg-black/40 rounded-lg">{robotsSnippet}</pre>
            </div>

            {/* 3. Head snippet */}
            <div className="bg-[#0A0A14] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white">3. HTML &lt;head&gt; Verification + Google Consent Mode v2 Snippet</span>
                <button
                  onClick={() => copyText(headSnippet, "head")}
                  className="px-3 py-1 rounded-lg bg-[#6C3AFF] text-white text-xs font-bold"
                >
                  {copiedSnippet === "head" ? "✔ Copied!" : "Copy <head> Code"}
                </button>
              </div>
              <pre className="text-xs text-gray-300 font-mono overflow-x-auto p-2 bg-black/40 rounded-lg">{headSnippet}</pre>
            </div>
          </div>
        )}

        {/* ── TAB 4: ADSENSE REVENUE & RPM CALCULATOR ── */}
        {activeTab === "calculator" && (
          <div className="bg-[#13131F] border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white mb-1">
                Google AdSense Revenue, Page RPM &amp; CPC Estimator
              </h2>
              <p className="text-xs text-gray-400">
                Estimate your monthly and annual AdSense earnings based on your site&apos;s category niche, visitor geography, and monthly pageviews.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Website Niche / Category</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-[#0A0A14] border border-white/10 rounded-xl px-3 py-3 text-xs text-white"
                >
                  {Object.entries(NICHES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Primary Audience Geography</label>
                <select
                  value={geo}
                  onChange={(e) => setGeo(e.target.value)}
                  className="w-full bg-[#0A0A14] border border-white/10 rounded-xl px-3 py-3 text-xs text-white"
                >
                  {Object.entries(GEO_TIERS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">
                  Monthly Pageviews: <span className="text-[#00D4FF]">{monthlyViews.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={5000}
                  max={1000000}
                  step={5000}
                  value={monthlyViews}
                  onChange={(e) => setMonthlyViews(Number(e.target.value))}
                  className="w-full accent-[#6C3AFF] mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0A0A14] border border-green-500/20 rounded-xl p-4">
                <div className="text-xs text-gray-400">Estimated Monthly Revenue</div>
                <div className="text-2xl font-black text-green-400 mt-1">${monthlyRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-[#0A0A14] border border-[#6C3AFF]/30 rounded-xl p-4">
                <div className="text-xs text-gray-400">Estimated Annual Revenue</div>
                <div className="text-2xl font-black text-white mt-1">${annualRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400">Estimated Page RPM</div>
                <div className="text-2xl font-black text-[#00D4FF] mt-1">${effectiveRpm}</div>
              </div>
              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400">Est. Monthly Ad Clicks (CPC ${effectiveCpc})</div>
                <div className="text-2xl font-black text-gray-200 mt-1">{monthlyClicks.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── AI-CITATION & FEATURED-SNIPPET REFERENCE TABLES (SERVER-RENDERED) ── */}
        <section className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">
              26-Point Google AdSense Readiness Scoring Matrix (2,600 Points Total)
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Reference specification used by PursTech&apos;s AdSense Readiness Auditor to calculate{" "}
              <code className="text-[#00D4FF]">Composite Score = Page Value × (Site-wide Quality / 100) × (Landing Page Quality / 100)</code>.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-300">
                  <th className="py-2.5 pr-4">Audit Category</th>
                  <th className="py-2.5 pr-4">Group</th>
                  <th className="py-2.5 pr-4">Max Score</th>
                  <th className="py-2.5 pr-4">Checks Included (26 Total)</th>
                  <th className="py-2.5">Passing Benchmark for AdSense Approval</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-white/5">
                  <td className="py-2.5 pr-4 font-bold text-white">1. Site Scale</td>
                  <td className="py-2.5 pr-4 text-purple-300 font-semibold">Hard</td>
                  <td className="py-2.5 pr-4 font-mono text-white">100 pts</td>
                  <td className="py-2.5 pr-4">Total indexed/sitemap URLs (1 check)</td>
                  <td className="py-2.5">25–30+ substantive tool or article URLs listed in XML sitemap</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 pr-4 font-bold text-white">2. Required Pages</td>
                  <td className="py-2.5 pr-4 text-purple-300 font-semibold">Hard</td>
                  <td className="py-2.5 pr-4 font-mono text-white">400 pts</td>
                  <td className="py-2.5 pr-4">/about, /privacy, /contact, /terms (4 checks)</td>
                  <td className="py-2.5">All 4 trust pages return HTTP 200 with DART cookie &amp; GDPR disclosures</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 pr-4 font-bold text-white">3. Site Structure</td>
                  <td className="py-2.5 pr-4 text-purple-300 font-semibold">Hard</td>
                  <td className="py-2.5 pr-4 font-mono text-white">300 pts</td>
                  <td className="py-2.5 pr-4">robots.txt, sitemap.xml, ads.txt (3 checks)</td>
                  <td className="py-2.5">Mediapartners-Google allowed; root ads.txt serves DIRECT publisher record</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 pr-4 font-bold text-white">4. Policy Compliance</td>
                  <td className="py-2.5 pr-4 text-purple-300 font-semibold">Hard</td>
                  <td className="py-2.5 pr-4 font-mono text-white">100 pts</td>
                  <td className="py-2.5 pr-4">Violating Keywords scan (1 check)</td>
                  <td className="py-2.5">Zero prohibited adult, gambling, pirated, or cracking terms across routes</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 pr-4 font-bold text-white">5. Content Quality</td>
                  <td className="py-2.5 pr-4 text-cyan-300 font-semibold">Soft</td>
                  <td className="py-2.5 pr-4 font-mono text-white">600 pts</td>
                  <td className="py-2.5 pr-4">Content Ratio, Subpage Depth, Filler, Template, Originality, Freshness (6 checks)</td>
                  <td className="py-2.5">75%+ content ratio, 1,500+ chars/page, ≥85/100 cross-page originality</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 pr-4 font-bold text-white">6. Landing Page Quality</td>
                  <td className="py-2.5 pr-4 text-cyan-300 font-semibold">Soft</td>
                  <td className="py-2.5 pr-4 font-mono text-white">600 pts</td>
                  <td className="py-2.5 pr-4">Homepage Chars, Single H1, Internal Links, Load Speed, Viewport, Overflow (6 checks)</td>
                  <td className="py-2.5">1,500+ homepage chars, 1 H1, 15+ internal links, &lt;1.8s load time</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-white">7. User Experience</td>
                  <td className="py-2.5 pr-4 text-cyan-300 font-semibold">Soft</td>
                  <td className="py-2.5 pr-4 font-mono text-white">500 pts</td>
                  <td className="py-2.5 pr-4">Mobile Font Size, Heading Hierarchy, Nav Landmarks, Touch Targets, Popups (5 checks)</td>
                  <td className="py-2.5">Clean H1→H2→H3 hierarchy, semantic &lt;nav&gt;, zero intrusive overlays</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto pt-4 border-t border-white/5">
            <h3 className="text-base font-extrabold text-white mb-3">
              Google AdSense Readiness Score &amp; Approval Probability Tiers (2026)
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-300">
                  <th className="py-2 pr-4">Composite Score Band</th>
                  <th className="py-2 pr-4">Hard Requirements Status</th>
                  <th className="py-2 pr-4">Estimated Approval Odds</th>
                  <th className="py-2">Recommended Publisher Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4 font-bold text-green-400">85 – 100 / 100 (Excellent)</td>
                  <td className="py-2 pr-4 text-green-400">READY (900/900 pts)</td>
                  <td className="py-2 pr-4 font-bold text-white">90% – 95% (High)</td>
                  <td className="py-2">Ready to submit. Check &ldquo;I confirm I have fixed the issues&rdquo; and click Request review.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4 font-bold text-cyan-400">75 – 84 / 100 (Strong)</td>
                  <td className="py-2 pr-4 text-yellow-400">READY or 1 Minor Warn</td>
                  <td className="py-2 pr-4 font-bold text-white">65% – 80% (Moderate-High)</td>
                  <td className="py-2">Clear any flagged keyword or thin subpage warnings to push above 85 before applying.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-bold text-red-400">Under 75 / 100 (At Risk)</td>
                  <td className="py-2 pr-4 text-red-400">NEEDS FIXES (&lt;900 pts)</td>
                  <td className="py-2 pr-4 font-bold text-white">20% – 45% (Low)</td>
                  <td className="py-2">Do not apply yet. Add missing policy pages, deploy ads.txt, and expand subpages to 500+ words.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Google AdSense Readiness Checker</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: "1", title: "Scan your live domain", desc: "Enter your root domain or URL in Tab 1 to run all 26 checks across your homepage, sitemap.xml, robots.txt, ads.txt, and sampled subpages." },
              { step: "2", title: "Clear Hard Requirements", desc: "Ensure all 4 Hard Categories (Site Scale, Required Pages, Site Structure, and Policy Compliance) hit 900/900 points with zero warnings." },
              { step: "3", title: "Test drafts & generate ads.txt", desc: "Use Tab 2 to verify new tool or blog pages exceed 500+ words and 75%+ content ratio, and Tab 3 to generate your exact ads.txt and Consent Mode v2 snippets." },
              { step: "4", title: "Export report & request review", desc: "Download your Markdown (.md) or JSON (.json) audit report for your records, validate indexing in Google Search Console, and submit your AdSense application." },
            ].map((s) => (
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

        {/* Technical Deep-Dive & Reference Guide */}
        <section className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 min-w-0 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            How Google AdSense Evaluates Websites: Overcoming &ldquo;Low Value Content&rdquo; &amp; Technical Rejections
          </h2>
          <div className="space-y-3">
            <p className="text-gray-400 text-sm leading-relaxed">
              When you submit a domain for Google AdSense review, Google&apos;s automated publisher crawlers (<code className="text-[#00D4FF] font-mono">Mediapartners-Google</code> and <code className="text-[#00D4FF] font-mono">Googlebot</code>) evaluate your site in two stages before a human reviewer ever inspects a page. In the first stage, the crawler checks structural and legal prerequisites: whether <code className="text-[#00D4FF] font-mono">/ads.txt</code> resolves with HTTP 200 OK from the root domain (or via a permanent 301/308 redirect to <code className="text-[#00D4FF] font-mono">www</code>), whether <code className="text-[#00D4FF] font-mono">/robots.txt</code> permits ad-crawler access, whether your <code className="text-[#00D4FF] font-mono">sitemap.xml</code> exposes a healthy scale of indexable routes (typically 25–30+ substantive pages), and whether mandatory trust disclosures (<code className="text-[#00D4FF] font-mono">/about</code>, <code className="text-[#00D4FF] font-mono">/privacy</code>, <code className="text-[#00D4FF] font-mono">/contact</code>, and <code className="text-[#00D4FF] font-mono">/terms</code>) are linked in the global footer.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              In the second stage, Google&apos;s Helpful Content and Publisher Quality algorithms evaluate every sampled subpage for <strong>&ldquo;Low value content&rdquo;</strong> and <strong>&ldquo;Ads on screens without publisher content.&rdquo;</strong> Modern React and Next.js web applications, online calculators, and SaaS tool portals frequently fail this check when individual routes only render an interactive input widget surrounded by navigation boilerplate, or when FAQ text is hidden inside unexpanded React <code className="text-[#00D4FF] font-mono">useState</code> hooks that do not exist in the initial server-rendered HTML payload. By embedding 500–800+ words of domain-specific technical explanations, semantic HTML <code className="text-[#00D4FF] font-mono">&lt;table&gt;</code> reference cards, and native HTML5 <code className="text-[#00D4FF] font-mono">&lt;details&gt;/&lt;summary&gt;</code> accordions on every tool and category page, publishers lift their content-to-boilerplate ratio above 90% and eliminate template clustering across subpages.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              PursTech&apos;s Google AdSense Eligibility &amp; Low Value Content Checker replicates this multi-layered inspection in real time. Using a 2,600-point scoring matrix across 26 checks and 5-dimension <code className="text-[#00D4FF] font-mono">V-O-T-C-R</code> (<code className="text-gray-300">Value</code>, <code className="text-gray-300">Originality</code>, <code className="text-gray-300">Translation</code>, <code className="text-gray-300">Compliance</code>, and <code className="text-gray-300">Relevance</code>) page grading, it pinpoints thin subpages, restricted policy keywords, and <code className="text-[#00D4FF] font-mono">ads.txt</code> configuration gaps so you can achieve a 90+/100 readiness score before clicking Request review.
            </p>
          </div>
        </section>

        {/* Native <details>/<summary> FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details
                key={i}
                className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all"
              >
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed whitespace-pre-line">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Related PursTech Blog Guides */}
        <section className="mt-10 min-w-0 w-full">
          <h2 className="text-lg font-extrabold text-white mb-4">📖 Related Guides &amp; Tutorials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0 w-full">
            <Link
              href="/blog/free-seo-tools-that-work"
              className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3 min-w-0"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">In-Depth Guide</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">
                  Free SEO Tools That Actually Work
                </div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
            </Link>
            <Link
              href="/blog/what-is-llms-txt-guide"
              className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3 min-w-0"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">In-Depth Guide</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">
                  What Is llms.txt? Make Your Site AI-Ready
                </div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
            </Link>
            <Link
              href="/blog/how-to-improve-readability-score"
              className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3 min-w-0"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">In-Depth Guide</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">
                  How to Improve Your Readability Score
                </div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
            </Link>
          </div>
        </section>

        {/* Related Free Tools */}
        <section className="mt-10 min-w-0 w-full">
          <h2 className="text-lg font-extrabold text-white mb-4">🔧 Related Free Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-0 w-full">
            <Link
              href="/tools/robots-txt-generator"
              className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 text-center transition-all group min-w-0"
            >
              <div className="text-2xl mb-1.5">🤖</div>
              <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                Robots.txt Generator
              </div>
            </Link>
            <Link
              href="/tools/sitemap-generator"
              className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 text-center transition-all group min-w-0"
            >
              <div className="text-2xl mb-1.5">🗺️</div>
              <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                XML Sitemap Generator
              </div>
            </Link>
            <Link
              href="/tools/llms-txt-generator"
              className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 text-center transition-all group min-w-0"
            >
              <div className="text-2xl mb-1.5">🧠</div>
              <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                llms.txt Generator
              </div>
            </Link>
            <Link
              href="/tools/ssl-checker"
              className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 text-center transition-all group min-w-0"
            >
              <div className="text-2xl mb-1.5">🔒</div>
              <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                SSL Certificate Checker
              </div>
            </Link>
          </div>
        </section>

        {/* Editorial E-E-A-T & Verification Attribution */}
        <div className="mt-10 bg-[#13131F]/80 border border-white/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/40 flex items-center justify-center text-[#00D4FF] font-bold flex-shrink-0">MI</span>
            <div>
              <span className="text-white font-semibold">Engineered &amp; Verified by <Link href="/about" className="text-[#00D4FF] hover:underline">Mahad Ikram</Link></span>
              <span className="block text-[11px] text-gray-500">Founder &amp; Lead Developer at PursTech · 100% Client-Side Browser Execution Verified (Nov 2026)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-500 flex-shrink-0">
            <Link href="/about" className="hover:text-white transition-colors">Editorial Standards</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Architecture</Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-10 text-center bg-[#0A0A14] w-full min-w-0">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1.5">
            50+ Free Browser-Based Online Tools — No Login, No Limits, 100% Client-Side Privacy.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs text-gray-400">
            <Link href="/tools" className="hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog &amp; Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            © 2026 PursTech · Engineered by <Link href="/about" className="text-gray-500 hover:text-gray-300">Mahad Ikram</Link>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
