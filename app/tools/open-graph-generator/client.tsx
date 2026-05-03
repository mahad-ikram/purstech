"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function OpenGraphClient() {
  const [fields, setFields]   = useState<OGFields>(DEFAULTS);
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [copied,   setCopied]  = useState(false);
  const [imgError, setImgError] = useState(false);

  const set = (k: keyof OGFields) => (v: string) =>
    setFields(prev => ({ ...prev, [k]: v }));

  const displayTitle  = fields.title       || "Your Page Title";
  const displayDesc   = fields.description || "Your page description will appear here when someone shares this link on social media.";
  const displayUrl    = fields.url         || "https://yourwebsite.com";
  const displayDomain = displayUrl.replace(/^https?:\/\//, "").split("/")[0];
  const displaySite   = fields.siteName    || displayDomain;

  function generateTags(): string {
    const lines: string[] = ["<!-- Open Graph / Facebook / LinkedIn -->"];
    lines.push(`<meta property="og:type" content="${fields.type}">`);
    if (fields.url)         lines.push(`<meta property="og:url" content="${fields.url}">`);
    if (fields.title)       lines.push(`<meta property="og:title" content="${fields.title}">`);
    if (fields.description) lines.push(`<meta property="og:description" content="${fields.description}">`);
    if (fields.image)       lines.push(`<meta property="og:image" content="${fields.image}">`);
    if (fields.siteName)    lines.push(`<meta property="og:site_name" content="${fields.siteName}">`);
    if (fields.locale)      lines.push(`<meta property="og:locale" content="${fields.locale}">`);
    lines.push("", "<!-- Twitter / X Card -->",
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

  // ── Platform Preview Renderers ──────────────────────────────────────────────
  function FacebookPreview() {
    return (
      <div className="bg-[#F0F2F5] rounded-xl overflow-hidden border border-gray-200">
        <div className="bg-gray-300 w-full h-40 flex items-center justify-center text-gray-400 text-sm relative overflow-hidden">
          {fields.image && !imgError
            ? <img src={fields.image} alt="" className="w-full h-full object-cover"
                onError={() => setImgError(true)} />
            : <span>1200 × 630 image</span>}
        </div>
        <div className="p-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase mb-0.5">{displayDomain}</div>
          <div className="font-bold text-gray-900 text-sm line-clamp-1">{displayTitle}</div>
          <div className="text-gray-500 text-xs mt-0.5 line-clamp-2">{displayDesc}</div>
          <div className="text-gray-400 text-xs mt-1">{displaySite}</div>
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
              ? <img src={fields.image} alt="" className="w-full h-full object-cover"
                  onError={() => setImgError(true)} />
              : <span>1200 × 628 image</span>}
          </div>
        ) : (
          <div className="flex gap-3 p-3">
            <div className="bg-gray-700 w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
              {fields.image && !imgError
                ? <img src={fields.image} alt="" className="w-full h-full object-cover rounded-xl"
                    onError={() => setImgError(true)} />
                : "img"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm line-clamp-1">{displayTitle}</div>
              <div className="text-gray-400 text-xs mt-0.5 line-clamp-2">{displayDesc}</div>
            </div>
          </div>
        )}
        {large && (
          <div className="p-3">
            <div className="font-bold text-white text-sm line-clamp-1">{displayTitle}</div>
            <div className="text-gray-400 text-xs mt-0.5 line-clamp-2">{displayDesc}</div>
            <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">🔗 {displayDomain}</div>
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
            ? <img src={fields.image} alt="" className="w-full h-full object-cover"
                onError={() => setImgError(true)} />
            : <span>1200 × 627 image</span>}
        </div>
        <div className="p-3">
          <div className="font-bold text-gray-900 text-sm line-clamp-2">{displayTitle}</div>
          <div className="text-gray-500 text-xs mt-0.5 line-clamp-2">{displayDesc}</div>
          <div className="text-gray-400 text-xs mt-1 uppercase tracking-wide">{displayDomain}</div>
        </div>
      </div>
    );
  }

  function DiscordPreview() {
    return (
      <div className="bg-[#2B2D31] rounded-xl overflow-hidden border-l-4 border-[#5865F2] p-3">
        {fields.siteName && (
          <div className="text-[#5865F2] text-xs font-bold mb-1">{fields.siteName}</div>
        )}
        <div className="text-blue-400 text-sm font-bold underline line-clamp-1 mb-1">{displayTitle}</div>
        <div className="text-gray-300 text-xs line-clamp-3 mb-2">{displayDesc}</div>
        {fields.image && !imgError && (
          <img src={fields.image} alt="" className="rounded-lg max-h-32 object-cover"
            onError={() => setImgError(true)} />
        )}
      </div>
    );
  }

  function SlackPreview() {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-3 flex gap-3">
        <div className="w-1 bg-[#4A154B] rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[#4A154B] text-xs font-bold mb-0.5">{displaySite}</div>
          <div className="text-gray-900 text-sm font-bold line-clamp-1 mb-0.5">{displayTitle}</div>
          <div className="text-gray-500 text-xs line-clamp-2 mb-2">{displayDesc}</div>
          {fields.image && !imgError && (
            <img src={fields.image} alt="" className="rounded-lg max-h-28 object-cover border border-gray-100"
              onError={() => setImgError(true)} />
          )}
        </div>
      </div>
    );
  }

  const previewMap = {
    facebook: <FacebookPreview />,
    twitter:  <TwitterPreview />,
    linkedin: <LinkedInPreview />,
    discord:  <DiscordPreview />,
    slack:    <SlackPreview />,
  };

  const encodedUrl = encodeURIComponent(fields.url || "https://yoursite.com");
  const debugLinks = [
    { name: "Facebook Debugger",   url: `https://developers.facebook.com/tools/debug/?q=${encodedUrl}` },
    { name: "LinkedIn Inspector",  url: `https://www.linkedin.com/post-inspector/inspect/${encodedUrl}` },
    { name: "Twitter Validator",   url: `https://cards-dev.twitter.com/validator` },
  ];

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
          <span className="text-gray-400">Open Graph Generator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">SEO Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Open Graph Tag Generator
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Generate Open Graph and Twitter Card tags with live previews for Facebook, Twitter/X, LinkedIn, Discord and Slack. See exactly how your links look before sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* Inputs */}
          <div className="xl:col-span-2 bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-4">
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Image URL <span className="text-gray-500 text-xs font-normal">— recommended 1200×630px</span>
              </label>
              <input value={fields.image} onChange={e => { set("image")(e.target.value); setImgError(false); }}
                placeholder="https://yoursite.com/og-image.png"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              {fields.image && imgError && (
                <p className="text-xs text-[#FF3A6C] mt-1">⚠ Image failed to load — check the URL</p>
              )}
              {fields.image && !imgError && (
                <p className="text-xs text-green-400 mt-1">✓ Image URL detected</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">Page URL</label>
              <input value={fields.url} onChange={e => set("url")(e.target.value)}
                placeholder="https://yoursite.com/page"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Site Name</label>
                <input value={fields.siteName} onChange={e => set("siteName")(e.target.value)}
                  placeholder="PursTech"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Content Type</label>
                <select value={fields.type} onChange={e => set("type")(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                  {["website","article","product","profile","video.movie","music.song"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Twitter Card</label>
                <select value={fields.twitterCard} onChange={e => set("twitterCard")(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                  <option value="summary_large_image">Large Image</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Twitter Handle</label>
                <input value={fields.twitterSite} onChange={e => set("twitterSite")(e.target.value)}
                  placeholder="@yoursite"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
            </div>
          </div>

          {/* Right — preview + output */}
          <div className="xl:col-span-3 flex flex-col gap-4">

            {/* Platform tabs */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      platform === p.id ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] text-gray-400 hover:text-white border border-white/5"
                    }`}>
                    <span>{p.icon}</span>{p.label}
                  </button>
                ))}
              </div>
              {previewMap[platform]}
            </div>

            {/* Debug links */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
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

            {/* Generated code */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated Tags</h3>
                <div className="flex gap-2">
                  <button onClick={() => setFields(DEFAULTS)}
                    className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs transition-all">
                    Reset
                  </button>
                  <button onClick={copy}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      copied ? "bg-green-600 text-white" : "bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white"
                    }`}>
                    {copied ? "✓ Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
              <pre className="text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 overflow-auto whitespace-pre-wrap font-mono leading-relaxed min-h-[180px]">
                {output}
              </pre>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Open Graph Generator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Fill in your details", desc:"Enter your page title, description, image URL, page URL and site name. Use the recommended dimensions for best results." },
              { step:"2", title:"Preview every platform", desc:"Click through Facebook, Twitter, LinkedIn, Discord and Slack tabs to see exactly how your link will look when shared on each platform." },
              { step:"3", title:"Copy and deploy", desc:"Click Copy Code and paste all tags inside your HTML <head> before the closing </head> tag. Works with any website or CMS." },
              { step:"4", title:"Clear the cache", desc:"After deploying, use the debug links to force Facebook, LinkedIn and Twitter to re-crawl your page and update their cached previews." },
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
              { q:"What are Open Graph tags and what do they do?", a:"Open Graph tags are HTML meta tags in the <head> section that control how your page appears when shared on social media — Facebook, LinkedIn, WhatsApp, Discord, Slack and more. They define the title, description and preview image of the share card. Without OG tags, platforms generate their own preview, which is often low quality and inconsistent." },
              { q:"What is the ideal Open Graph image size?", a:"The recommended OG image size is 1200×630 pixels at a 1.91:1 aspect ratio. This displays correctly on all major platforms. The minimum is 600×315 pixels, but smaller images may appear blurry or cropped. Keep the file size under 8MB. Facebook requires a minimum of 200×200 pixels to show any image at all." },
              { q:"How long does it take for new OG tags to appear on social platforms?", a:"Social platforms cache link preview data. After adding or updating OG tags, you need to clear the cache using each platform's URL debugger. Use the debug links in our generator — Facebook Sharing Debugger, LinkedIn Post Inspector and Twitter Card Validator — to force an immediate re-crawl of your updated tags." },
              { q:"Do Open Graph tags affect Google SEO rankings?", a:"OG tags do not directly influence Google search rankings. However, they indirectly improve SEO by increasing social sharing, which generates backlinks and drives traffic. Better-looking share cards also increase click-through rates from social media, sending more traffic to your site. Google uses OG tags to better understand page content in some contexts." },
              { q:"What is the difference between og:title and the HTML title tag?", a:"The HTML title tag is used by browsers (shown in the tab bar) and by Google in search results. The og:title is used by social platforms when someone shares your link. They serve different audiences and can have different text. Your page title might be optimised for search while your og:title might be more conversational and engaging for social sharing." },
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
