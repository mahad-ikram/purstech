"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ── Bot reference database ─────────────────────────────────────────────────────
const BOT_DB: Record<string, { name:string; purpose:string; company:string; shouldBlock:boolean }> = {
  "*":              { name:"All Bots",         purpose:"Wildcard — applies to all crawlers",          company:"—",         shouldBlock:false },
  "Googlebot":      { name:"Googlebot",        purpose:"Google's main search crawler",                company:"Google",    shouldBlock:false },
  "Bingbot":        { name:"Bingbot",          purpose:"Microsoft Bing search crawler",               company:"Microsoft", shouldBlock:false },
  "Slurp":          { name:"Yahoo Slurp",      purpose:"Yahoo search crawler",                        company:"Yahoo",     shouldBlock:false },
  "DuckDuckBot":    { name:"DuckDuckBot",      purpose:"DuckDuckGo search crawler",                   company:"DDG",       shouldBlock:false },
  "GPTBot":         { name:"GPTBot",           purpose:"OpenAI — trains ChatGPT on your content",     company:"OpenAI",    shouldBlock:true  },
  "ClaudeBot":      { name:"ClaudeBot",        purpose:"Anthropic — trains Claude AI",                company:"Anthropic", shouldBlock:true  },
  "CCBot":          { name:"CCBot",            purpose:"Common Crawl — used for AI training data",    company:"CC",        shouldBlock:true  },
  "Google-Extended":{ name:"Google-Extended",  purpose:"Google — trains Gemini AI models",            company:"Google",    shouldBlock:true  },
  "anthropic-ai":   { name:"Anthropic AI",     purpose:"Anthropic — older crawler for Claude",        company:"Anthropic", shouldBlock:true  },
  "Cohere-ai":      { name:"Cohere AI",        purpose:"Cohere — trains enterprise AI models",        company:"Cohere",    shouldBlock:true  },
  "Omgilibot":      { name:"Omgilibot",        purpose:"Omgili — scrapers for AI and analysis",       company:"Omgili",    shouldBlock:true  },
  "FacebookBot":    { name:"FacebookBot",      purpose:"Facebook — crawls for link previews/AI",      company:"Meta",      shouldBlock:true  },
  "Diffbot":        { name:"Diffbot",          purpose:"Diffbot — extracts structured data",          company:"Diffbot",   shouldBlock:true  },
};

const CMS_PRESETS: Record<string, string> = {
  "none": "",
  "wordpress": "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n",
  "shopify": "User-agent: *\nDisallow: /admin\nDisallow: /cart\nDisallow: /orders\nDisallow: /checkout\nDisallow: /account\nDisallow: /search\n",
  "nextjs": "User-agent: *\nDisallow: /api/\nDisallow: /_next/\n",
};

// ✅ Rule 8: FAQ uses <details>/<summary> — no useState toggle
// ✅ Rule 10: FAQ matches const FAQ
const FAQ = [
  { q: "What is a robots.txt file?", a: "A robots.txt file tells search engine crawlers which URLs the crawler can access on your site. This is used mainly to avoid overloading your site with requests, or to keep certain pages out of Google. It is not a mechanism for keeping a web page out of Google. To keep a web page out of Google, block indexing with noindex or password-protect the page." },
  { q: "Where should I put my robots.txt file?", a: "The robots.txt file must be located at the root of the website host to which it applies. For example, to control crawling on all URLs below https://www.example.com/, the robots.txt file must be located at https://www.example.com/robots.txt." },
  { q: "How do I block AI bots like GPTBot or Claude?", a: "You can block specific AI bots by targeting their User-Agent. Our generator includes a 1-click toggle to block the most common AI scrapers (GPTBot, ClaudeBot, CCBot, Google-Extended, etc.) from training their language models on your content." },
  { q: "What does 'User-agent: *' mean?", a: "The asterisk (*) is a wildcard. 'User-agent: *' means the rule applies to all web crawlers, except those that have their own specific User-agent block." },
  { q: "How does the Sitemap directive work in robots.txt?", a: "You can point crawlers to your XML sitemap by adding a line at the bottom of your robots.txt file: Sitemap: https://yoursite.com/sitemap.xml. This helps all search engines discover your sitemap automatically. You can include multiple Sitemap lines for multiple sitemap files. This complements but does not replace submitting your sitemap directly in Google Search Console." }
];

interface Rule {
  id: string;
  agent: string;
  directive: "Allow" | "Disallow";
  path: string;
}

export default function RobotsTxtClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("robots-txt-generator", "seo"); // ✅ Rule 3

  const [preset, setPreset] = useState<string>("none");
  const [sitemap, setSitemap] = useState<string>("");
  const [blockAI, setBlockAI] = useState<boolean>(false);
  const [rules, setRules] = useState<Rule[]>([
    { id: "init-rule", agent: "*", directive: "Disallow", path: "/admin/" }
  ]);
  const [testUrl, setTestUrl] = useState<string>("");
  const [testAgent, setTestAgent] = useState<string>("*");
  const [copied, setCopied] = useState(false);

  const addRule = () => {
    setRules(p => [...p, { id: Math.random().toString(36).slice(2), agent: "*", directive: "Disallow", path: "/" }]);
    setPreset("none");
  };

  const updateRule = (id: string, field: keyof Rule, val: string) => {
    setRules(p => p.map(r => r.id === id ? { ...r, [field]: val } : r));
    setPreset("none");
  };

  const removeRule = (id: string) => {
    setRules(p => p.filter(r => r.id !== id));
    setPreset("none");
  };

  const applyPreset = (p: string) => {
    setPreset(p);
    if (p === "none") {
      setRules([{ id: Math.random().toString(36).slice(2), agent: "*", directive: "Disallow", path: "/" }]);
      return;
    }
    const presetStr = CMS_PRESETS[p];
    const newRules: Rule[] = [];
    const lines = presetStr.split("\n").filter(Boolean);
    let currentAgent = "*";
    lines.forEach(line => {
      if (line.startsWith("User-agent:")) currentAgent = line.split(":")[1].trim();
      else if (line.startsWith("Allow:")) newRules.push({ id: Math.random().toString(36).slice(2), agent: currentAgent, directive: "Allow", path: line.split(":")[1].trim() });
      else if (line.startsWith("Disallow:")) newRules.push({ id: Math.random().toString(36).slice(2), agent: currentAgent, directive: "Disallow", path: line.split(":")[1].trim() });
    });
    setRules(newRules);
  };

  const generatedRobots = useMemo(() => {
    let out = "# Generated by PursTech Robots.txt Generator\n# https://www.purstech.com/tools/robots-txt-generator\n\n";

    const groups: Record<string, Rule[]> = {};
    rules.forEach(r => {
      if (!r.path.trim()) return;
      if (!groups[r.agent]) groups[r.agent] = [];
      groups[r.agent].push(r);
    });

    Object.entries(groups).forEach(([agent, agentRules]) => {
      out += `User-agent: ${agent}\n`;
      agentRules.forEach(r => { out += `${r.directive}: ${r.path}\n`; });
      out += "\n";
    });

    if (blockAI) {
      out += "# AI Bot Blocking Rules\n";
      Object.entries(BOT_DB).filter(([, v]) => v.shouldBlock).forEach(([agent]) => {
        out += `User-agent: ${agent}\nDisallow: /\n\n`;
      });
    }

    if (sitemap.trim()) out += `Sitemap: ${sitemap.trim()}\n`;

    return out.trim();
  }, [rules, blockAI, sitemap]);

  const testResult = useMemo(() => {
    if (!testUrl.trim()) return null;
    let urlPath = testUrl;
    try {
      const u = new URL(testUrl);
      urlPath = u.pathname + u.search;
    } catch {
      if (!testUrl.startsWith("/")) urlPath = "/" + testUrl;
    }

    let isAllowed = true;
    const matchingRules: string[] = [];
    const agentRules = rules.filter(r => r.agent.toLowerCase() === testAgent.toLowerCase() || r.agent === "*");
    let longestMatch = 0;

    agentRules.forEach(r => {
      if (urlPath.startsWith(r.path) || (r.path === "/" && urlPath.startsWith("/"))) {
        if (r.path.length >= longestMatch) {
          longestMatch = r.path.length;
          isAllowed = r.directive === "Allow";
          matchingRules.push(`${r.directive}: ${r.path} (Agent: ${r.agent})`);
        }
      }
    });

    if (blockAI && BOT_DB[testAgent]?.shouldBlock) {
      isAllowed = false;
      matchingRules.push(`Disallow: / (Blocked AI Scraper)`);
    }

    return { isAllowed, matchingRules: matchingRules.reverse() };
  }, [testUrl, testAgent, rules, blockAI]);

  const downloadTxt = () => {
    const blob = new Blob([generatedRobots], { type: "text/plain" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: "robots.txt",
    }).click();
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedRobots);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — ✅ Rule 4: sticky + backdrop-blur + Go Pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full on main */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/seo + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/seo" className="hover:text-gray-400">SEO Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Robots.txt Generator</span>
        </nav>

        {/* Server-rendered hero from page.tsx */}
        {children}

        {/* ✅ Rule 9: min-w-0 w-full on grid and children */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 min-w-0 w-full">

          {/* ── LEFT: Settings & Rules ── */}
          <div className="xl:col-span-3 min-w-0 w-full flex flex-col gap-5">

            {/* CMS Presets & Sitemap */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 w-full">
              <div className="min-w-0 w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CMS Preset</label>
                <select value={preset} onChange={e => applyPreset(e.target.value)}
                  className="w-full min-w-0 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/50 transition-all cursor-pointer">
                  <option value="none">Custom Rules</option>
                  <option value="wordpress">WordPress</option>
                  <option value="shopify">Shopify</option>
                  <option value="nextjs">Next.js</option>
                </select>
              </div>
              <div className="min-w-0 w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sitemap URL (Optional)</label>
                <input value={sitemap} onChange={e => setSitemap(e.target.value)}
                  placeholder="https://yoursite.com/sitemap.xml"
                  className="w-full min-w-0 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/50 transition-all" />
              </div>
            </div>

            {/* Block AI Scrapers Toggle */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex items-center justify-between min-w-0 w-full gap-4 flex-wrap">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white mb-1">Block AI Scrapers</h3>
                <p className="text-xs text-gray-500">Automatically disallow GPTBot, ClaudeBot, CCBot, Google-Extended and others from training on your content.</p>
              </div>
              <button onClick={() => setBlockAI(p => !p)}
                className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${blockAI ? "bg-[#6C3AFF]" : "bg-gray-700"}`}
                role="switch" aria-checked={blockAI}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${blockAI ? "left-[26px]" : "left-1"}`} />
              </button>
            </div>

            {/* Custom Rules Builder */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Custom Rules</h3>
                <button onClick={addRule} className="text-[#6C3AFF] hover:text-white text-sm font-semibold transition-colors">+ Add Rule</button>
              </div>

              {rules.length === 0 ? (
                <div className="text-center py-6 text-gray-600 text-sm bg-[#0A0A14] rounded-xl border border-white/5 border-dashed">
                  No custom rules set. All bots will be allowed by default.
                </div>
              ) : (
                <div className="space-y-3 min-w-0 w-full">
                  {rules.map((r, i) => (
                    <div key={r.id} className="flex flex-col sm:flex-row items-center gap-2 bg-[#0A0A14] p-2 rounded-xl border border-white/5 min-w-0 w-full">
                      <select value={r.agent} onChange={e => updateRule(r.id, "agent", e.target.value)}
                        className="w-full sm:w-1/3 min-w-0 px-3 py-2.5 rounded-lg bg-[#13131F] border border-white/5 text-gray-300 text-sm focus:outline-none focus:border-[#6C3AFF]/50">
                        {Object.keys(BOT_DB).map(b => <option key={b} value={b}>{b}</option>)}
                      </select>

                      <select value={r.directive} onChange={e => updateRule(r.id, "directive", e.target.value as "Allow"|"Disallow")}
                        className={`w-full sm:w-1/4 min-w-0 px-3 py-2.5 rounded-lg bg-[#13131F] border text-sm font-bold focus:outline-none focus:border-[#6C3AFF]/50 ${
                          r.directive === "Allow" ? "text-green-400 border-green-400/20" : "text-red-400 border-red-400/20"
                        }`}>
                        <option value="Disallow">Disallow</option>
                        <option value="Allow">Allow</option>
                      </select>

                      <div className="w-full sm:w-full min-w-0 relative">
                        <input value={r.path} onChange={e => updateRule(r.id, "path", e.target.value)}
                          placeholder="/path/to/folder/"
                          className={`w-full min-w-0 px-3 py-2.5 rounded-lg bg-[#13131F] border text-white text-sm focus:outline-none transition-all ${
                            !r.path.startsWith("/") && r.path !== "" ? "border-yellow-500/50" : "border-white/5 focus:border-[#6C3AFF]/50"
                          }`} />
                        {/* ✅ UI Validation: Path must start with / */}
                        {!r.path.startsWith("/") && r.path !== "" && (
                          <span className="absolute -top-3 right-2 text-[10px] text-yellow-400 bg-[#13131F] px-1 font-bold rounded">⚠ Path must start with /</span>
                        )}
                      </div>

                      <button onClick={() => removeRule(r.id)} title="Remove Rule"
                        className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#FF3A6C]/10 text-[#FF3A6C] hover:bg-[#FF3A6C]/20 transition-all text-sm font-bold flex-shrink-0">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Output & Testing ── */}
          <div className="xl:col-span-2 min-w-0 w-full flex flex-col gap-5">
            
            {/* Generated Output */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated robots.txt</h3>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="text-xs bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all">
                    {copied ? "✓ Copied" : "📋 Copy"}
                  </button>
                  <button onClick={downloadTxt} className="text-xs bg-[#6C3AFF]/20 text-[#6C3AFF] hover:bg-[#6C3AFF]/40 px-3 py-1.5 rounded-lg font-bold transition-all">
                    ⬇ Download
                  </button>
                </div>
              </div>
              {/* ✅ Rule 9: break-words and min-w-0 applied to <pre> output */}
              <pre className="text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 min-h-[300px] overflow-auto whitespace-pre-wrap break-all min-w-0 w-full font-mono leading-relaxed border border-white/5">
                {generatedRobots}
              </pre>
            </div>

            {/* Live URL Tester */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Live URL Tester</h3>
              <p className="text-xs text-gray-600 mb-3">Verify if a specific URL or path is allowed for a bot based on your generated rules above.</p>
              
              <div className="space-y-3 min-w-0 w-full">
                <div className="min-w-0 w-full">
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">Select Bot to Test</label>
                  <select value={testAgent} onChange={e => setTestAgent(e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-lg bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/50">
                    {Object.keys(BOT_DB).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="min-w-0 w-full">
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">Test URL or Path</label>
                  <input value={testUrl} onChange={e => setTestUrl(e.target.value)}
                    placeholder="/blog/hidden-post/"
                    className="w-full min-w-0 px-3 py-2 rounded-lg bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/50 transition-all font-mono" />
                </div>
                
                {testResult && testUrl.trim() && (
                  <div className={`mt-2 p-4 rounded-xl border ${testResult.isAllowed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl ${testResult.isAllowed ? "text-green-400" : "text-red-400"}`}>
                        {testResult.isAllowed ? "✅" : "🚫"}
                      </span>
                      <div>
                        <div className={`font-bold text-sm ${testResult.isAllowed ? "text-green-400" : "text-red-400"}`}>
                          {testResult.isAllowed ? "Allowed" : "Blocked"}
                        </div>
                        <div className="text-[10px] text-gray-500">for {testAgent}</div>
                      </div>
                    </div>
                    {testResult.matchingRules.length > 0 && (
                      <div className="text-xs font-mono text-gray-400 mt-2 bg-[#0A0A14] p-2 rounded break-all min-w-0 w-full">
                        <span className="text-gray-600">Matched rule:</span><br/>
                        {testResult.matchingRules[0]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Common Bots Reference */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Common Bots Guide</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 min-w-0 w-full">
                {Object.entries(BOT_DB).map(([agent, info]) => (
                  <div key={agent} className="bg-[#0A0A14] p-3 rounded-lg border border-white/5 min-w-0 w-full">
                    <div className="flex justify-between items-center mb-1 gap-2">
                      <span className="font-mono text-sm text-[#6C3AFF] break-all">{agent}</span>
                      <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded flex-shrink-0">{info.company}</span>
                    </div>
                    <div className="text-xs text-gray-400 break-words min-w-0 w-full">{info.purpose}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Create a Robots.txt File</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Choose a preset",    desc:"Select WordPress, Shopify or Next.js to instantly populate the recommended allow and disallow paths for your CMS." },
              { step:"2", title:"Add custom rules",   desc:"Add specific paths you want to block (Disallow) or allow. Remember to always start paths with a forward slash (/). Select which bot the rule applies to." },
              { step:"3", title:"Block AI Scrapers",  desc:"Toggle the Block AI switch to instantly append rules that stop GPTBot, Claude, CCBot and others from training on your website's content." },
              { step:"4", title:"Test & Download",    desc:"Use the Live Tester to ensure your private paths are actually blocked. Once verified, click Download and place the file in your website's root directory." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — Rule 8: <details>/<summary>, Rule 10: FAQ.map() matches const FAQ at module scope */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Rule 5: /about→/terms + Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
