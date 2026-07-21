"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ Rule 8: FAQ uses <details>/<summary> — no useState toggle
// ✅ Rule 10: FAQ matches FAQ_SCHEMA in page.tsx
const FAQ = [
  { q: "What is an llms.txt file?",
    a: "llms.txt is a plain-text file placed at your site root (yoursite.com/llms.txt) that lists your key pages in a simple Markdown format so AI assistants and browsing agents can quickly understand and cite your site. It was proposed by Jeremy Howard in 2024 and is inspired by robots.txt and sitemap.xml." },
  { q: "Where do I put the llms.txt file?",
    a: "Upload it to the root of your domain so it is reachable at https://yoursite.com/llms.txt — the same location as robots.txt. On most frameworks you drop it in your public or static folder." },
  { q: "Does llms.txt help SEO or Google rankings?",
    a: "No. Google has confirmed llms.txt is not used for Search or AI Overviews rankings. Its purpose is agentic readiness — helping AI assistants and browsing agents read and cite your content accurately. Treat it as documentation for AI, not an SEO ranking signal." },
  { q: "What format should an llms.txt file use?",
    a: "An H1 title, an optional one-line summary in a blockquote, an optional description paragraph, then H2 sections that each contain a Markdown list of links in the form - [Page name](url): short note. This tool generates that exact format automatically." },
  { q: "Do AI assistants actually read llms.txt?",
    a: "Adoption is early but growing. Some AI tools and crawlers look for llms.txt today and others do not yet. Because it is a tiny static file with no downside, many sites add it now to be ready as adoption increases." },
  { q: "Is this llms.txt generator free?",
    a: "Yes, completely free with no login. Everything runs in your browser, so your site details are never uploaded to a server." },
];

interface LinkItem { id: string; name: string; url: string; note: string; }
interface Section { id: string; name: string; links: LinkItem[]; }

const uid = () => Math.random().toString(36).slice(2, 9);

const EXAMPLE: Section[] = [
  { id: uid(), name: "Docs", links: [
    { id: uid(), name: "Getting Started", url: "https://acme.com/docs/start", note: "Install and authenticate in 5 minutes" },
    { id: uid(), name: "API Reference",   url: "https://acme.com/docs/api",   note: "Full REST and GraphQL endpoint reference" },
  ] },
  { id: uid(), name: "Guides", links: [
    { id: uid(), name: "Accepting Payments", url: "https://acme.com/guides/payments", note: "" },
  ] },
  { id: uid(), name: "Optional", links: [
    { id: uid(), name: "Changelog", url: "https://acme.com/changelog", note: "Release notes and version history" },
  ] },
];

export default function LlmsTxtGeneratorClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("llms-txt-generator", "seo"); // ✅ Rule 3

  const [siteName, setSiteName] = useState("Acme Docs");
  const [summary, setSummary]   = useState("Developer documentation for the Acme payments API and SDKs.");
  const [details, setDetails]   = useState("Acme provides REST and GraphQL APIs for payments. Use the links below to find guides, references and support resources.");
  const [sections, setSections] = useState<Section[]>(EXAMPLE);
  const [copied, setCopied]     = useState(false);

  // ── Section + link mutators (immutable) ──
  const addSection = () =>
    setSections(s => [...s, { id: uid(), name: "", links: [{ id: uid(), name: "", url: "", note: "" }] }]);
  const removeSection = (sid: string) =>
    setSections(s => s.filter(x => x.id !== sid));
  const updateSectionName = (sid: string, name: string) =>
    setSections(s => s.map(x => x.id === sid ? { ...x, name } : x));
  const addLink = (sid: string) =>
    setSections(s => s.map(x => x.id === sid ? { ...x, links: [...x.links, { id: uid(), name: "", url: "", note: "" }] } : x));
  const removeLink = (sid: string, lid: string) =>
    setSections(s => s.map(x => x.id === sid ? { ...x, links: x.links.filter(l => l.id !== lid) } : x));
  const updateLink = (sid: string, lid: string, field: keyof LinkItem, value: string) =>
    setSections(s => s.map(x => x.id === sid
      ? { ...x, links: x.links.map(l => l.id === lid ? { ...l, [field]: value } : l) }
      : x));

  const loadExample = () => {
    setSiteName("Acme Docs");
    setSummary("Developer documentation for the Acme payments API and SDKs.");
    setDetails("Acme provides REST and GraphQL APIs for payments. Use the links below to find guides, references and support resources.");
    setSections(EXAMPLE.map(sec => ({ ...sec, id: uid(), links: sec.links.map(l => ({ ...l, id: uid() })) })));
  };
  const clearAll = () => {
    setSiteName("");
    setSummary("");
    setDetails("");
    setSections([{ id: uid(), name: "", links: [{ id: uid(), name: "", url: "", note: "" }] }]);
  };

  // ── Build spec-compliant llms.txt (llmstxt.org markdown-link format) ──
  const generated = useMemo(() => {
    const lines: string[] = [];
    lines.push("<!-- llms.txt generated with PursTech · https://www.purstech.com/tools/llms-txt-generator -->");
    lines.push("");
    lines.push("# " + (siteName.trim() || "Your Site Name"));
    if (summary.trim()) { lines.push(""); lines.push("> " + summary.trim()); }
    if (details.trim()) { lines.push(""); lines.push(details.trim()); }
    sections.forEach(sec => {
      const valid = sec.links.filter(l => l.name.trim() && l.url.trim());
      if (!sec.name.trim() && valid.length === 0) return;
      lines.push("");
      lines.push("## " + (sec.name.trim() || "Section"));
      lines.push("");
      valid.forEach(l => {
        const note = l.note.trim();
        lines.push("- [" + l.name.trim() + "](" + l.url.trim() + ")" + (note ? ": " + note : ""));
      });
    });
    return lines.join("\n") + "\n";
  }, [siteName, summary, details, sections]);

  const downloadTxt = () => {
    const blob = new Blob([generated], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "llms.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = "w-full min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all";

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
          <span className="text-gray-400">llms.txt Generator</span>
        </nav>

        {/* Server-rendered hero from page.tsx */}
        {children}

        {/* ✅ Rule 9: min-w-0 w-full on grid and children */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 min-w-0 w-full">

          {/* ── LEFT: Builder ── */}
          <div className="xl:col-span-3 min-w-0 w-full flex flex-col gap-5">

            {/* Site details */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 min-w-0 w-full">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-white">Site details</h2>
                <div className="flex gap-2">
                  <button onClick={loadExample} className="text-xs bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all">Load example</button>
                  <button onClick={clearAll} className="text-xs bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all">Clear</button>
                </div>
              </div>
              <div className="min-w-0 w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Site name <span className="text-[#FF3A6C]">*</span></label>
                <input value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="e.g. Acme Docs"
                  aria-label="Site name" className={inputCls} />
                <p className="text-[11px] text-gray-600 mt-1.5">Becomes the H1 title of your llms.txt.</p>
              </div>
              <div className="min-w-0 w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Summary</label>
                <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="One line describing what your site does"
                  aria-label="Summary" className={inputCls} />
                <p className="text-[11px] text-gray-600 mt-1.5">Shown as a blockquote under the title.</p>
              </div>
              <div className="min-w-0 w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
                <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} placeholder="A short paragraph giving AI assistants more context about your site."
                  aria-label="Description" className={inputCls + " resize-y"} />
              </div>
            </div>

            {/* Sections */}
            {sections.map((sec, si) => (
              <div key={sec.id} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 min-w-0 w-full">
                <div className="flex items-center gap-3 min-w-0 w-full">
                  <span className="text-[11px] font-bold text-[#6C3AFF] bg-[#6C3AFF]/10 px-2 py-1 rounded-md flex-shrink-0">Section {si + 1}</span>
                  <input value={sec.name} onChange={e => updateSectionName(sec.id, e.target.value)} placeholder="Section name — e.g. Docs, Guides, Products"
                    aria-label={"Section " + (si + 1) + " name"} className={inputCls} />
                  <button onClick={() => removeSection(sec.id)} aria-label={"Remove section " + (si + 1)}
                    className="text-xs text-gray-600 hover:text-[#FF3A6C] px-2 py-1.5 rounded-lg transition-all flex-shrink-0" title="Remove section">✕</button>
                </div>

                {sec.links.map((l, li) => (
                  <div key={l.id} className="bg-[#0A0A14] border border-white/5 rounded-xl p-3 flex flex-col gap-2 min-w-0 w-full">
                    <div className="flex items-center gap-2 min-w-0 w-full">
                      <span className="text-[10px] text-gray-600 font-mono flex-shrink-0 w-10">Link {li + 1}</span>
                      <input value={l.name} onChange={e => updateLink(sec.id, l.id, "name", e.target.value)} placeholder="Link text"
                        aria-label={"Link " + (li + 1) + " name"} className={inputCls} />
                      <button onClick={() => removeLink(sec.id, l.id)} aria-label={"Remove link " + (li + 1)}
                        className="text-xs text-gray-600 hover:text-[#FF3A6C] px-2 py-1 rounded-lg transition-all flex-shrink-0" title="Remove link">✕</button>
                    </div>
                    <input value={l.url} onChange={e => updateLink(sec.id, l.id, "url", e.target.value)} placeholder="https://yoursite.com/page"
                      aria-label={"Link " + (li + 1) + " URL"} className={inputCls + " font-mono text-xs"} />
                    <input value={l.note} onChange={e => updateLink(sec.id, l.id, "note", e.target.value)} placeholder="Optional short note about this page"
                      aria-label={"Link " + (li + 1) + " note"} className={inputCls} />
                  </div>
                ))}

                <button onClick={() => addLink(sec.id)}
                  className="text-xs text-[#6C3AFF] hover:text-white font-semibold self-start transition-all">+ Add link</button>
              </div>
            ))}

            <button onClick={addSection}
              className="bg-[#6C3AFF]/10 border border-dashed border-[#6C3AFF]/40 text-[#6C3AFF] hover:bg-[#6C3AFF]/20 rounded-2xl py-3 text-sm font-bold transition-all">
              + Add section
            </button>
          </div>

          {/* ── RIGHT: Live preview ── */}
          <div className="xl:col-span-2 min-w-0 w-full">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 xl:sticky xl:top-24 min-w-0 w-full">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated llms.txt</h3>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={copyToClipboard} className="text-xs bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all">
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                  <button onClick={downloadTxt} className="text-xs bg-[#6C3AFF]/20 text-[#6C3AFF] hover:bg-[#6C3AFF]/40 px-3 py-1.5 rounded-lg font-bold transition-all">
                    Download
                  </button>
                </div>
              </div>
              <pre className="bg-[#0A0A14] border border-white/5 rounded-xl p-4 text-xs text-gray-300 font-mono whitespace-pre-wrap break-words overflow-y-auto max-h-[32rem] min-w-0 w-full">{generated}</pre>
              <p className="text-[11px] text-gray-600 mt-3 leading-relaxed">
                Save this as <code className="text-[#6C3AFF] font-mono">llms.txt</code> and upload it to the root of your
                domain — <code className="text-gray-400 font-mono">yoursite.com/llms.txt</code>.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Create an llms.txt File</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Enter site details", desc: "Add your site name and a one-line summary describing what your site does. Add an optional longer description for extra context." },
              { step: "2", title: "Add your key pages", desc: "Create sections such as Docs, Guides or Products, then add the important pages you want AI assistants to know about — each with a short note." },
              { step: "3", title: "Copy or download",   desc: "Preview updates live as you type. Copy the result or download the llms.txt file. Everything runs in your browser — nothing is uploaded." },
              { step: "4", title: "Upload to root",     desc: "Place llms.txt at the root of your domain (yoursite.com/llms.txt) — the same spot as robots.txt. On most frameworks, drop it in your public folder." },
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

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
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
