"use client";

import { useState } from "react";
import Link from "next/link";

interface OGFields {
  title:       string;
  description: string;
  image:       string;
  url:         string;
  type:        string;
  siteName:    string;
  twitterCard: string;
  twitterSite: string;
  locale:      string;
}

const DEFAULTS: OGFields = {
  title:       "",
  description: "",
  image:       "",
  url:         "",
  type:        "website",
  siteName:    "",
  twitterCard: "summary_large_image",
  twitterSite: "",
  locale:      "en_US",
};

export default function OpenGraphClient() {
  const [fields, setFields] = useState<OGFields>(DEFAULTS);
  const [preview, setPreview] = useState<"facebook" | "twitter">("facebook");
  const [copied, setCopied] = useState(false);

  const set = (k: keyof OGFields) => (v: string) =>
    setFields(prev => ({ ...prev, [k]: v }));

  function generateTags(): string {
    const lines: string[] = ["<!-- Open Graph / Facebook -->"];
    lines.push(`<meta property="og:type" content="${fields.type}">`);
    if (fields.url)         lines.push(`<meta property="og:url" content="${fields.url}">`);
    if (fields.title)       lines.push(`<meta property="og:title" content="${fields.title}">`);
    if (fields.description) lines.push(`<meta property="og:description" content="${fields.description}">`);
    if (fields.image)       lines.push(`<meta property="og:image" content="${fields.image}">`);
    if (fields.siteName)    lines.push(`<meta property="og:site_name" content="${fields.siteName}">`);
    if (fields.locale)      lines.push(`<meta property="og:locale" content="${fields.locale}">`);

    lines.push("", "<!-- Twitter / X -->",
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

  const displayTitle  = fields.title       || "Your Page Title";
  const displayDesc   = fields.description || "Your page description will appear here when someone shares your link on social media.";
  const displayUrl    = fields.url         || "https://yoursite.com";
  const displayDomain = displayUrl.replace(/^https?:\/\//, "").split("/")[0];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">

        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Open Graph Generator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Open Graph Tag Generator
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Generate Open Graph and Twitter Card meta tags with a live social media preview. Control exactly how your links appear on Facebook, LinkedIn and Twitter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Inputs */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-white/5 pb-3">Page Details</h3>

            {[
              { key: "title",       label: "Title",           placeholder: "Your page title",                    max: 60  },
              { key: "description", label: "Description",     placeholder: "A compelling description (1–2 sentences)", max: 160 },
              { key: "image",       label: "Image URL",       placeholder: "https://yoursite.com/og-image.png",  max: 0   },
              { key: "url",         label: "Page URL",        placeholder: "https://yoursite.com/page",          max: 0   },
              { key: "siteName",    label: "Site Name",       placeholder: "Your Site Name",                     max: 0   },
              { key: "twitterSite", label: "Twitter Handle",  placeholder: "@yoursite",                          max: 0   },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-white mb-1">{field.label}</label>
                {field.key === "description" ? (
                  <div>
                    <textarea
                      value={(fields as unknown as Record<string, string>)[field.key]}
                      onChange={e => set(field.key as keyof OGFields)(e.target.value)}
                      placeholder={field.placeholder} rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none" />
                    <div className="flex justify-end">
                      <span className={`text-xs ${fields.description.length > 160 ? "text-[#FF3A6C]" : "text-gray-500"}`}>
                        {fields.description.length}/160
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      value={(fields as unknown as Record<string, string>)[field.key]}
                      onChange={e => set(field.key as keyof OGFields)(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                    {field.max > 0 && (
                      <div className="flex justify-end mt-1">
                        <span className={`text-xs ${(fields as unknown as Record<string, string>)[field.key].length > field.max ? "text-[#FF3A6C]" : "text-gray-500"}`}>
                          {(fields as unknown as Record<string, string>)[field.key].length}/{field.max}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Content Type</label>
                <select value={fields.type} onChange={e => set("type")(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                  {["website","article","product","profile","video","music"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Twitter Card</label>
                <select value={fields.twitterCard} onChange={e => set("twitterCard")(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                  <option value="summary_large_image">Large Image</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview + Output */}
          <div className="flex flex-col gap-4">

            {/* Preview card */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex gap-2 mb-4">
                {(["facebook","twitter"] as const).map(p => (
                  <button key={p} onClick={() => setPreview(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      preview === p ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] text-gray-400 hover:text-white border border-white/5"
                    }`}>
                    {p === "facebook" ? "📘 Facebook / LinkedIn" : "𝕏 Twitter"}
                  </button>
                ))}
              </div>

              {preview === "facebook" ? (
                <div className="bg-[#F0F2F5] rounded-xl overflow-hidden">
                  {fields.image ? (
                    <img src={fields.image} alt="OG Preview" className="w-full h-40 object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-400 text-sm">
                      1200×630 image preview
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-xs text-gray-500 uppercase mb-1">{displayDomain}</div>
                    <div className="font-bold text-gray-900 text-sm line-clamp-1">{displayTitle}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{displayDesc}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-black rounded-xl overflow-hidden">
                  {fields.image ? (
                    <img src={fields.image} alt="Twitter Preview" className="w-full h-40 object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
                      Twitter Card Image
                    </div>
                  )}
                  <div className="p-3">
                    <div className="font-bold text-white text-sm line-clamp-1">{displayTitle}</div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">{displayDesc}</div>
                    <div className="text-xs text-gray-500 mt-1">🔗 {displayDomain}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Generated code */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated Tags</h3>
                <button onClick={copy}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copied ? "bg-green-600 text-white" : "bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white"
                  }`}>
                  {copied ? "✓ Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="flex-1 text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 overflow-auto whitespace-pre-wrap font-mono leading-relaxed min-h-[200px]">
                {output}
              </pre>
            </div>
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
