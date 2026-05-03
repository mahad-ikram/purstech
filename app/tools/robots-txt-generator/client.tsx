"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── Bot reference database ─────────────────────────────────────────────────────
const BOT_DB: Record<string, { name: string; purpose: string; company: string; shouldBlock: boolean }> = {
  "*":           { name: "All Bots",     purpose: "Wildcard — applies to all crawlers",      company: "—",        shouldBlock: false },
  "Googlebot":   { name: "Googlebot",    purpose: "Google's main search crawler",             company: "Google",   shouldBlock: false },
  "Bingbot":     { name: "Bingbot",      purpose: "Microsoft Bing search crawler",            company: "Microsoft",shouldBlock: false },
  "Slurp":       { name: "Yahoo Slurp",  purpose: "Yahoo search crawler",                     company: "Yahoo",    shouldBlock: false },
  "DuckDuckBot": { name: "DuckDuckBot",  purpose: "DuckDuckGo search crawler",               company: "DDG",      shouldBlock: false },
  "GPTBot":      { name: "GPTBot",       purpose: "OpenAI — trains ChatGPT on your content", company: "OpenAI",   shouldBlock: true  },
  "ClaudeBot":   { name: "ClaudeBot",    purpose: "Anthropic — trains Claude AI",            company: "Anthropic",shouldBlock: true  },
  "CCBot":       { name: "CCBot",        purpose: "Common Crawl — used for AI training data", company: "CC",       shouldBlock: true  },
  "anthropic-ai":{ name: "Anthropic AI", purpose: "Anthropic AI data collection",            company: "Anthropic",shouldBlock: true  },
  "Google-Extended": { name: "Google Extended", purpose: "Google AI training (Gemini)",      company: "Google",   shouldBlock: true  },
  "AhrefsBot":   { name: "AhrefsBot",   purpose: "SEO tool — backlink analysis crawler",     company: "Ahrefs",   shouldBlock: false },
  "SemrushBot":  { name: "SemrushBot",  purpose: "SEMrush SEO tool crawler",                 company: "SEMrush",  shouldBlock: false },
  "MJ12bot":     { name: "MJ12bot",     purpose: "Majestic SEO crawler",                     company: "Majestic", shouldBlock: false },
  "DotBot":      { name: "DotBot",      purpose: "Moz SEO crawler",                          company: "Moz",      shouldBlock: false },
};

// ── CMS Presets ────────────────────────────────────────────────────────────────
const CMS_PRESETS: Record<string, { agent: string; disallow: string }[]> = {
  "WordPress": [
    { agent: "*", disallow: "/wp-admin/" },
    { agent: "*", disallow: "/wp-includes/" },
    { agent: "*", disallow: "/?s=" },
    { agent: "*", disallow: "/wp-login.php" },
    { agent: "*", disallow: "/xmlrpc.php" },
  ],
  "Shopify": [
    { agent: "*", disallow: "/admin/" },
    { agent: "*", disallow: "/cart" },
    { agent: "*", disallow: "/checkout" },
    { agent: "*", disallow: "/account" },
    { agent: "*", disallow: "/policies/" },
  ],
  "Next.js / Vercel": [
    { agent: "*", disallow: "/api/" },
    { agent: "*", disallow: "/_next/" },
    { agent: "*", disallow: "/admin/" },
  ],
  "Block AI Bots": [
    { agent: "GPTBot",          disallow: "/" },
    { agent: "ClaudeBot",       disallow: "/" },
    { agent: "CCBot",           disallow: "/" },
    { agent: "anthropic-ai",    disallow: "/" },
    { agent: "Google-Extended", disallow: "/" },
  ],
  "Allow All": [
    { agent: "*", disallow: "" },
  ],
  "Block All": [
    { agent: "*", disallow: "/" },
  ],
};

let uid = 1;
interface Rule { id: number; agent: string; disallow: string; allow: string; crawlDelay: string; }

const TODAY = new Date().toISOString().slice(0, 10);

export default function RobotsTxtClient() {
  const [rules, setRules]     = useState<Rule[]>([
    { id: uid++, agent: "*", disallow: "/admin/", allow: "", crawlDelay: "" },
  ]);
  const [sitemap, setSitemap] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [copied,  setCopied]  = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [activePreset, setActivePreset] = useState("");

  function addRule() {
    setRules(p => [...p, { id: uid++, agent: "*", disallow: "", allow: "", crawlDelay: "" }]);
  }
  function removeRule(id: number) { setRules(p => p.filter(r => r.id !== id)); }
  function updateRule(id: number, f: keyof Omit<Rule,"id">, v: string) {
    setRules(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
  }

  function applyPreset(name: string) {
    const preset = CMS_PRESETS[name];
    setRules(preset.map(p => ({ id: uid++, agent: p.agent, disallow: p.disallow, allow: "", crawlDelay: "" })));
    setActivePreset(name);
  }

  // ── URL Tester ────────────────────────────────────────────────────────────────
  const testResult = useMemo(() => {
    if (!testUrl.trim()) return null;
    const url = testUrl.startsWith("/") ? testUrl : "/" + testUrl;

    for (const rule of rules) {
      if (rule.allow && url.startsWith(rule.allow)) {
        return { allowed: true, matchedRule: `Allow: ${rule.allow}`, agent: rule.agent };
      }
      if (rule.disallow && url.startsWith(rule.disallow)) {
        return { allowed: false, matchedRule: `Disallow: ${rule.disallow}`, agent: rule.agent };
      }
    }
    return { allowed: true, matchedRule: "No matching rule — defaults to allowed", agent: "*" };
  }, [testUrl, rules]);

  // ── Generate robots.txt ────────────────────────────────────────────────────
  function generate(): string {
    const byAgent: Record<string, { allow: string[]; disallow: string[]; delay: string }> = {};
    rules.forEach(r => {
      if (!byAgent[r.agent]) byAgent[r.agent] = { allow: [], disallow: [], delay: "" };
      if (r.disallow) byAgent[r.agent].disallow.push(r.disallow);
      if (r.allow)    byAgent[r.agent].allow.push(r.allow);
      if (r.crawlDelay) byAgent[r.agent].delay = r.crawlDelay;
    });

    const lines = [
      "# robots.txt — Generated by PursTech",
      `# Created: ${TODAY}`,
      `# https://purstech.com/tools/robots-txt-generator`,
      "",
    ];

    Object.entries(byAgent).forEach(([agent, data]) => {
      lines.push(`User-agent: ${agent}`);
      if (data.delay)              lines.push(`Crawl-delay: ${data.delay}`);
      data.disallow.forEach(p  => lines.push(p ? `Disallow: ${p}` : "Disallow:"));
      data.allow.forEach(p     => lines.push(`Allow: ${p}`));
      lines.push("");
    });

    if (sitemap.trim()) lines.push(`Sitemap: ${sitemap.trim()}`);
    return lines.join("\n").trim();
  }

  const output = generate();

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  function download() {
    const b = new Blob([output], { type: "text/plain" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(b), download: "robots.txt" });
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }

  const botList = Object.keys(BOT_DB);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Robots.txt Generator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Robots.txt Generator Online
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Create a valid robots.txt file with CMS templates, per-bot rules, AI crawler blocking and a live URL tester. Download or copy with one click.
          </p>
        </div>

        {/* CMS Presets */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">⚡ CMS & Platform Presets</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(CMS_PRESETS).map(name => (
              <button key={name} onClick={() => applyPreset(name)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  activePreset === name
                    ? "bg-[#6C3AFF] text-white border-transparent"
                    : name === "Block AI Bots"
                      ? "bg-[#FF3A6C]/10 border-[#FF3A6C]/30 text-[#FF3A6C] hover:bg-[#FF3A6C]/20"
                      : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white hover:border-[#6C3AFF]/30"
                }`}>
                {name === "Block AI Bots" ? "🤖 " : ""}{name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* Left — Rules + URL tester */}
          <div className="xl:col-span-3 space-y-4">

            {/* Rules builder */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Crawler Rules</h3>
                <button onClick={addRule}
                  className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                  + Add Rule
                </button>
              </div>
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {rules.map(rule => {
                  const botInfo = BOT_DB[rule.agent];
                  return (
                    <div key={rule.id} className="bg-[#0A0A14] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <select value={rule.agent}
                            onChange={e => updateRule(rule.id, "agent", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#13131F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                            {botList.map(b => (
                              <option key={b} value={b}>
                                {BOT_DB[b]?.name || b} {BOT_DB[b]?.shouldBlock ? "⚠" : ""}
                              </option>
                            ))}
                          </select>
                          {botInfo && (
                            <p className={`text-xs mt-1 ${botInfo.shouldBlock ? "text-yellow-400" : "text-gray-500"}`}>
                              {botInfo.shouldBlock ? "⚠ " : "✓ "}{botInfo.purpose} · {botInfo.company}
                            </p>
                          )}
                        </div>
                        <button onClick={() => removeRule(rule.id)}
                          className="ml-3 text-gray-600 hover:text-[#FF3A6C] transition-colors text-sm flex-shrink-0">×</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-red-400 font-semibold mb-1 block">Disallow</label>
                          <input value={rule.disallow}
                            onChange={e => updateRule(rule.id, "disallow", e.target.value)}
                            placeholder="/admin/"
                            className="w-full px-3 py-2 rounded-lg bg-[#13131F] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all font-mono" />
                        </div>
                        <div>
                          <label className="text-xs text-green-400 font-semibold mb-1 block">Allow</label>
                          <input value={rule.allow}
                            onChange={e => updateRule(rule.id, "allow", e.target.value)}
                            placeholder="/public/"
                            className="w-full px-3 py-2 rounded-lg bg-[#13131F] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all font-mono" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="text-xs text-gray-500 font-semibold mb-1 block">Crawl-delay (seconds)</label>
                        <input value={rule.crawlDelay}
                          onChange={e => updateRule(rule.id, "crawlDelay", e.target.value)}
                          placeholder="10" type="number" min="0"
                          className="w-32 px-3 py-2 rounded-lg bg-[#13131F] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sitemap */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <label className="block text-sm font-semibold text-white mb-2">Sitemap URL</label>
              <input value={sitemap} onChange={e => setSitemap(e.target.value)}
                placeholder="https://yoursite.com/sitemap.xml"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
            </div>

            {/* URL Tester */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-3">🧪 URL Tester</h3>
              <p className="text-xs text-gray-500 mb-3">Test whether a URL path would be crawled or blocked by your current rules.</p>
              <input value={testUrl} onChange={e => setTestUrl(e.target.value)}
                placeholder="/admin/dashboard"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all mb-3" />
              {testResult && (
                <div className={`rounded-xl p-4 border ${
                  testResult.allowed
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-[#FF3A6C]/10 border-[#FF3A6C]/20"
                }`}>
                  <div className={`text-sm font-bold mb-1 ${testResult.allowed ? "text-green-400" : "text-[#FF3A6C]"}`}>
                    {testResult.allowed ? "✓ This URL would be CRAWLED" : "✗ This URL would be BLOCKED"}
                  </div>
                  <div className="text-xs text-gray-400">
                    Matched rule: <code className="text-cyan-400">{testResult.matchedRule}</code>
                    {" "} · Agent: <code className="text-cyan-400">{testResult.agent}</code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — Output */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">robots.txt</h3>
                  <span className="text-xs text-gray-600">{rules.length} rules</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={copy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      copied ? "bg-green-600 text-white" : "bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                  <button onClick={download}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      downloaded ? "bg-green-600 text-white" : "bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white"
                    }`}>
                    {downloaded ? "✓ Saved!" : "⬇ Download"}
                  </button>
                </div>
              </div>
              <pre className="flex-1 text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 overflow-auto whitespace-pre-wrap font-mono leading-relaxed min-h-[400px]">
                {output}
              </pre>
              <div className="mt-4 bg-[#0A0A14] rounded-xl p-3">
                <p className="text-xs text-gray-500 font-semibold mb-1">📋 Deployment</p>
                <p className="text-xs text-gray-500">Upload as <code className="text-cyan-400">robots.txt</code> to your website root so it is accessible at <code className="text-cyan-400">yoursite.com/robots.txt</code></p>
              </div>
            </div>

            {/* Bot Reference */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-3">🤖 Bot Reference Guide</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {Object.entries(BOT_DB).filter(([k]) => k !== "*").map(([agent, info]) => (
                  <div key={agent} className="flex items-start gap-2 text-xs">
                    <span className={`flex-shrink-0 mt-0.5 ${info.shouldBlock ? "text-yellow-400" : "text-green-400"}`}>
                      {info.shouldBlock ? "⚠" : "✓"}
                    </span>
                    <div>
                      <span className="font-semibold text-white">{agent}</span>
                      <span className="text-gray-500"> — {info.purpose}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Robots.txt Generator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Pick a preset", desc:"Select your CMS platform for instant pre-configured rules. Use 'Block AI Bots' to prevent AI training on your content." },
              { step:"2", title:"Customise rules", desc:"Add, edit or remove crawl rules. Consult the Bot Reference Guide to understand what each user-agent does." },
              { step:"3", title:"Test your URLs", desc:"Use the URL Tester to verify which paths would be crawled or blocked before you deploy your file." },
              { step:"4", title:"Download & deploy", desc:"Click Download and upload robots.txt to your website root. Add your sitemap URL at the bottom for faster indexing." },
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

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q:"What is a robots.txt file and why do I need one?", a:"A robots.txt file placed at your website root tells search engine crawlers which pages they can or cannot visit. Without one, crawlers index everything by default. A robots.txt lets you block admin pages, duplicate content and low-value URLs — improving crawl efficiency and preventing private pages from appearing in search results." },
              { q:"Does blocking a page in robots.txt prevent it from appearing in Google?", a:"Not always. robots.txt prevents crawlers from accessing page content, but Google can still index a URL if it appears in a link from another page — it just won't know the content. To fully prevent a URL from appearing in search results, use a 'noindex' meta tag or HTTP header instead. robots.txt and noindex serve different purposes and you can use both together." },
              { q:"Should I block AI bots like GPTBot and ClaudeBot?", a:"This is your choice as a content owner. AI bots like GPTBot (OpenAI) and ClaudeBot (Anthropic) crawl websites to train large language models. If you don't want your content used for AI training, disallow these bots in your robots.txt. Use our 'Block AI Bots' preset to block the most common AI training crawlers with one click." },
              { q:"What is Crawl-delay and should I use it?", a:"Crawl-delay tells a bot how many seconds to wait between page requests. This is useful for servers with limited resources that can't handle aggressive crawling. However, Google officially ignores Crawl-delay — it manages its own crawl rate based on your server's response times. Crawl-delay is respected by some other bots including Bingbot." },
              { q:"Where should I put my sitemap in robots.txt?", a:"Add a Sitemap directive at the bottom of your robots.txt file: Sitemap: https://yoursite.com/sitemap.xml. This helps all search engines discover your sitemap automatically. You can include multiple Sitemap lines for multiple sitemap files. This complements but does not replace submitting your sitemap directly in Google Search Console." },
            ].map((faq, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
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
