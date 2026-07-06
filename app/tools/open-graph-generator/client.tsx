"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

const PLATFORMS = [
  { id: "facebook",  label: "Facebook",  icon: "📘" },
  { id: "twitter",   label: "Twitter/X", icon: "𝕏"  },
  { id: "linkedin",  label: "LinkedIn",  icon: "💼" },
  { id: "discord",   label: "Discord",   icon: "💬" },
  { id: "slack",     label: "Slack",     icon: "🔔" },
] as const;

type Platform = typeof PLATFORMS[number]["id"];

interface OGFields {
  title: string; description: string; image: string; url: string;
  type: string; siteName: string; twitterCard: string; twitterSite: string; locale: string;
}

const DEFAULTS: OGFields = {
  title: "", description: "", image: "", url: "",
  type: "website", siteName: "", twitterCard: "summary_large_image", twitterSite: "", locale: "en_US",
};

// ✅ Rule 10: FAQ declared at module scope — .map() below uses same name
const FAQ = [
  { q: "What size should an og:image be?",
    a: "1200 x 630 pixels (a 1.91:1 ratio) — sharp on Facebook, LinkedIn and X large cards. Keep it under 1 MB as JPG or PNG. The built-in image validator confirms your URL actually loads before you ship the tags." },
  { q: "What are Open Graph tags and why do I need them?",
    a: "Open Graph tags are HTML meta tags in your page head that control how your page appears when shared on social media. Without them, Facebook, LinkedIn, Discord and WhatsApp make their own guess — often showing the wrong title or no image. Adding OG tags takes under 5 minutes and dramatically improves click-through rates from social sharing."
  },
  { q: "What image size should I use for Open Graph?",
    a: "The recommended size is 1200×630px (1.91:1 aspect ratio) for Facebook and LinkedIn. Twitter large image cards use 1200×628. The minimum is 600×315 — images below this may not show at all. Always use HTTPS URLs for your OG image, as HTTP images are often blocked by platforms."
  },
  { q: "How long should my OG title and description be?",
    a: "OG titles should be under 60 characters for best display. Facebook truncates titles at around 60 characters. OG descriptions should be 150–160 characters. Write for the shortest display (Facebook) and you will look good everywhere."
  },
  { q: "Why doesn't my OG image update after I change it?",
    a: "Social platforms aggressively cache OG data. After updating your tags, force a re-crawl using the Facebook Sharing Debugger, LinkedIn Post Inspector and Twitter Card Validator — links are provided in our tool. The cache typically updates within a few minutes."
  },
  { q: "Do I need both OG tags and Twitter Card tags?",
    a: "Yes — Twitter has its own tag format (twitter:card, twitter:title etc.) and uses these over OG tags when present. Most other platforms use OG tags. Our generator creates both sets simultaneously so you get complete coverage with one copy-paste."
  },
];

export default function OpenGraphClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("open-graph-generator", "seo"); // ✅ Rule 3

  const [fields,   setFields]   = useState<OGFields>(DEFAULTS);
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [copied,   setCopied]   = useState(false);
  const [imgError, setImgError] = useState(false);

  const set = (k: keyof OGFields) => (v: string) =>
    setFields(prev => ({ ...prev, [k]: v }));

  const displayTitle  = fields.title       || "Your Page Title";
  const displayDesc   = fields.description || "Your page description will appear here when someone shares this link on social media.";
  const displayUrl    = fields.url         || "https://yourwebsite.com";
  const displayDomain = displayUrl.replace(/^https?:\/\//, "").split("/")[0];
  const displaySite   = fields.siteName    || displayDomain;

  function generateTags(): string {
    const lines: string[] = [""];
    lines.push(`<meta property="og:type" content="${fields.type}">`);
    if (fields.url)         lines.push(`<meta property="og:url" content="${fields.url}">`);
    if (fields.title)       lines.push(`<meta property="og:title" content="${fields.title}">`);
    if (fields.description) lines.push(`<meta property="og:description" content="${fields.description}">`);
    if (fields.image)       lines.push(`<meta property="og:image" content="${fields.image}">`);
    if (fields.siteName)    lines.push(`<meta property="og:site_name" content="${fields.siteName}">`);
    if (fields.locale)      lines.push(`<meta property="og:locale" content="${fields.locale}">`);

    lines.push("", "",
      `<meta name="twitter:card" content="${fields.twitterCard}">`);
    if (fields.twitterSite) lines.push(`<meta name="twitter:site" content="${fields.twitterSite}">`);
    if (fields.url)         lines.push(`<meta name="twitter:url" content="${fields.url}">`);
    if (fields.title)       lines.push(`<meta name="twitter:title" content="${fields.title}">`);
    if (fields.description) lines.push(`<meta name="twitter:description" content="${fields.description}">`);
    if (fields.image)       lines.push(`<meta name="twitter:image" content="${fields.image}">`);
    return lines.join("\n");
  }

  const output = generateTags();

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ✅ UI Enhancement: Download as .html snippet
  function downloadTags() {
    const snippet = `\n\n\n${output}`;
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([snippet], { type: "text/html" })),
      download: "og-tags.html",
    }).click();
  }

  // ── Platform Preview Renderers ──────────────────────────────────────────────
  function FacebookPreview() {
    return (
      <div className="bg-[#F0F2F5] rounded-xl overflow-hidden border border-gray-200">
        <div className="bg-gray-300 w-full h-40 flex items-center justify-center text-gray-400 text-sm relative overflow-hidden">
          {fields.image && !imgError
            ? <img src={fields.image} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
            : <span>1200 × 630 image</span>}
        </div>
        <div className="p-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase mb-0.5">{displayDomain}</div>
          <div className="font-bold text-gray-900 text-sm line-clamp-1 break-words">{displayTitle}</div>
          <div className="text-gray-500 text-xs mt-0.5 line-clamp-2 break-words">{displayDesc}</div>
          <div className="text-gray-400 text-xs mt-1 truncate">{displaySite}</div>
        </div>
      </div>
    );
  }

  function TwitterPreview() {
    const large = fields.twitterCard === "summary_large_image";
    return (
      <div className="bg-black rounded-2xl overflow-hidden border border-gray-700">
        {large ? (
          <div className="bg-gray-800 w-full h-40 flex items-center justify-center text-gray-500 text-sm relative overflow-hidden">
            {fields.image && !imgError
              ? <img src={fields.image} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
              : <span>1200 × 628 image</span>}
          </div>
        ) : (
          <div className="flex gap-3 p-3">
            <div className="bg-gray-700 w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-500 text-xs overflow-hidden">
              {fields.image && !imgError
                ? <img src={fields.image} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                : "img"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm line-clamp-1 break-words">{displayTitle}</div>
              <div className="text-gray-400 text-xs mt-0.5 line-clamp-2 break-words">{displayDesc}</div>
            </div>
          </div>
        )}
        {large && (
          <div className="p-3">
            <div className="font-bold text-white text-sm line-clamp-1 break-words">{displayTitle}</div>
            <div className="text-gray-400 text-xs mt-0.5 line-clamp-2 break-words">{displayDesc}</div>
            <div className="text-gray-500 text-xs mt-1 flex items-center gap-1 truncate">🔗 {displayDomain}</div>
          </div>
        )}
      </div>
    );
  }

  function LinkedInPreview() {
    return (
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-gray-200 w-full h-36 flex items-center justify-center text-gray-400 text-sm relative overflow-hidden">
          {fields.image && !imgError
            ? <img src={fields.image} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
            : <span>1200 × 627 image</span>}
        </div>
        <div className="p-3">
          <div className="font-bold text-gray-900 text-sm line-clamp-2 break-words">{displayTitle}</div>
          <div className="text-gray-500 text-xs mt-0.5 line-clamp-2 break-words">{displayDesc}</div>
          <div className="text-gray-400 text-xs mt-1 uppercase tracking-wide truncate">{displayDomain}</div>
        </div>
      </div>
    );
  }

  function DiscordPreview() {
    return (
      <div className="bg-[#2B2D31] rounded-xl overflow-hidden border-l-4 border-[#5865F2] p-3">
        {fields.siteName && <div className="text-[#5865F2] text-xs font-bold mb-1 truncate">{fields.siteName}</div>}
        <div className="text-blue-400 text-sm font-bold underline line-clamp-1 mb-1 break-words">{displayTitle}</div>
        <div className="text-gray-300 text-xs line-clamp-3 mb-2 break-words">{displayDesc}</div>
        {fields.image && !imgError && (
          <img src={fields.image} alt="" className="rounded-lg max-h-32 object-cover max-w-full" onError={() => setImgError(true)} />
        )}
      </div>
    );
  }

  function SlackPreview() {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-3 flex gap-3">
        <div className="w-1 bg-[#4A154B] rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[#4A154B] text-xs font-bold mb-0.5 truncate">{displaySite}</div>
          <div className="text-gray-900 text-sm font-bold line-clamp-1 mb-0.5 break-words">{displayTitle}</div>
          <div className="text-gray-500 text-xs line-clamp-2 mb-2 break-words">{displayDesc}</div>
          {fields.image && !imgError && (
            <img src={fields.image} alt="" className="rounded-lg max-h-28 object-cover max-w-full border border-gray-100" onError={() => setImgError(true)} />
          )}
        </div>
      </div>
    );
  }

  const previewMap: Record<Platform, React.ReactNode> = {
    facebook: <FacebookPreview />,
    twitter:  <TwitterPreview />,
    linkedin: <LinkedInPreview />,
    discord:  <DiscordPreview />,
    slack:    <SlackPreview />,
  };

  const encodedUrl = encodeURIComponent(fields.url || "https://yoursite.com");
  const debugLinks = [
    { name: "Facebook Debugger",  url: `https://developers.facebook.com/tools/debug/?q=${encodedUrl}` },
    { name: "LinkedIn Inspector", url: `https://www.linkedin.com/post-inspector/inspect/${encodedUrl}` },
    { name: "Twitter Validator",  url: `https://cards-dev.twitter.com/validator` },
  ];

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden on root div
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
      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/seo + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/seo" className="hover:text-gray-400 transition-colors">SEO Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Open Graph Generator</span>
        </nav>

        {/* Server-rendered hero from page.tsx */}
        {children}

        {/* ✅ Grid constraints locked safely */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-12 min-w-0 w-full">

          {/* Input panel — ✅ min-w-0 */}
          <div className="xl:col-span-2 min-w-0 bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-white/5 pb-3">Page Details</h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-white">Title</label>
                <span className={`text-xs ${fields.title.length > 60 ? "text-[#FF3A6C]" : "text-gray-500"}`}>
                  {fields.title.length}/60
                </span>
              </div>
              <input value={fields.title} onChange={e => set("title")(e.target.value)}
                placeholder="Your compelling page title"
                className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-white">Description</label>
                <span className={`text-xs ${fields.description.length > 160 ? "text-[#FF3A6C]" : "text-gray-500"}`}>
                  {fields.description.length}/160
                </span>
              </div>
              <textarea value={fields.description} onChange={e => set("description")(e.target.value)}
                rows={3} placeholder="A compelling 1–2 sentence description of your page..."
                className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Image URL <span className="text-gray-500 text-xs font-normal">— recommended 1200×630px</span>
              </label>
              <input value={fields.image} onChange={e => { set("image")(e.target.value); setImgError(false); }}
                placeholder="https://yoursite.com/og-image.png"
                className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              {fields.image && imgError  && <p className="text-xs text-[#FF3A6C] mt-1 break-words">⚠ Image failed to load — check the URL</p>}
              {fields.image && !imgError && <p className="text-xs text-green-400 mt-1 break-words">✓ Image URL detected</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">Page URL</label>
              <input value={fields.url} onChange={e => set("url")(e.target.value)}
                placeholder="https://yoursite.com/page"
                className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-white mb-1">Site Name</label>
                <input value={fields.siteName} onChange={e => set("siteName")(e.target.value)}
                  placeholder="PursTech"
                  className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-white mb-1">Content Type</label>
                <select value={fields.type} onChange={e => set("type")(e.target.value)}
                  className="w-full min-w-0 px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all cursor-pointer">
                  {["website","article","product","profile","video.movie","music.song"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-white mb-1">Twitter Card</label>
                <select value={fields.twitterCard} onChange={e => set("twitterCard")(e.target.value)}
                  className="w-full min-w-0 px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all cursor-pointer">
                  <option value="summary_large_image">Large Image</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-white mb-1">Twitter Handle</label>
                <input value={fields.twitterSite} onChange={e => set("twitterSite")(e.target.value)}
                  placeholder="@yoursite"
                  className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
            </div>
          </div>

          {/* Preview + output — ✅ min-w-0 */}
          <div className="xl:col-span-3 min-w-0 flex flex-col gap-4">

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0">
              <div className="flex gap-1 mb-4 overflow-x-auto pb-1 w-full">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                      platform === p.id ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] text-gray-400 hover:text-white border border-white/5"
                    }`}>
                    <span>{p.icon}</span>{p.label}
                  </button>
                ))}
              </div>
              {previewMap[platform]}
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0">
              <h3 className="text-sm font-bold text-white mb-3">🔍 Clear Cache on Social Platforms</h3>
              <p className="text-xs text-gray-500 mb-3">After updating OG tags, force social platforms to re-fetch your page:</p>
              <div className="flex flex-wrap gap-2">
                {debugLinks.map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white hover:border-[#6C3AFF]/30 text-xs font-semibold transition-all">
                    {link.name} ↗
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col min-w-0 w-full">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated Tags</h3>
                <div className="flex gap-2">
                  <button onClick={() => setFields(DEFAULTS)}
                    className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs transition-all">
                    Reset
                  </button>
                  <button onClick={downloadTags}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all">
                    ⬇ .html
                  </button>
                  <button onClick={copy}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      copied ? "bg-green-600 text-white" : "bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white"
                    }`}>
                    {copied ? "✓ Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
              {/* ✅ Full Break-All layout bound */}
              <pre className="text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 overflow-auto whitespace-pre-wrap font-mono leading-relaxed min-h-[180px] w-full break-all">
                {output}
              </pre>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Open Graph Generator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Fill in your details",   desc:"Enter your page title, description, image URL, page URL and site name. Use the recommended 1200×630px dimensions for best results." },
              { step:"2", title:"Preview every platform", desc:"Click through Facebook, Twitter, LinkedIn, Discord and Slack tabs to see exactly how your link will look when shared on each platform." },
              { step:"3", title:"Copy and deploy",        desc:"Click Copy Code and paste all tags inside your HTML head before the closing tag. Or download as a .html snippet file for later." },
              { step:"4", title:"Clear the cache",        desc:"After deploying, use the debug links to force Facebook, LinkedIn and Twitter to re-crawl and update cached previews." },
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

        {/* ✅ Rule 8: FAQ uses <details>/<summary> — no useState */}
        {/* ✅ Rule 10: FAQ.map() matches `const FAQ` declared at module scope */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none select-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Rule 5: © 2026 + Privacy/Terms/Contact */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center bg-[#0A0A14]">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center flex-wrap gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}