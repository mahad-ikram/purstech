"use client";

// ✅ Removed unused useEffect + useRef imports (lint warnings)
import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ ADDED

// ✅ SCHEMA const + <script> tag REMOVED — now server-rendered in page.tsx

const FAQ = [
  { q:"What is Markdown and why convert from HTML?",
    a:"Markdown is a lightweight markup language that uses plain text formatting syntax to produce HTML. It's widely used in README files, documentation, CMS platforms (Ghost, Gatsby, Jekyll), note-taking apps (Obsidian, Notion) and developer platforms (GitHub, GitLab). Converting from HTML to Markdown lets you take content from websites or HTML editors and move it into any Markdown-based platform while preserving the formatting." },
  { q:"What HTML elements does this converter support?",
    a:"The converter handles all standard HTML elements: headings (h1–h6), paragraphs, bold (strong, b), italic (em, i), strikethrough (del, s), inline code (code), code blocks (pre), blockquotes (blockquote), unordered lists (ul/li), ordered lists (ol/li), links (a), images (img), horizontal rules (hr), and tables (table/thead/tbody/tr/th/td) using GitHub Flavored Markdown (GFM) table syntax." },
  { q:"What is GitHub Flavored Markdown (GFM)?",
    a:"GitHub Flavored Markdown (GFM) is a widely-adopted extension of standard Markdown that adds: tables (using | pipe separators), task lists (- [ ] and - [x]), strikethrough (~~text~~), fenced code blocks with language identifiers (```javascript), and @mentions. GFM is the default on GitHub, GitLab, VS Code, many CMS platforms and developer tools. Our converter outputs GFM-compatible Markdown by default." },
  { q:"How do I handle iframes, scripts and embedded content?",
    a:"Iframes, scripts, style tags and other non-content HTML elements have no Markdown equivalent and are stripped out during conversion. This is typically the desired behaviour — you want the text content, not scripts or tracking code. If you need to embed external content in Markdown, raw HTML blocks are supported in most Markdown processors." },
  { q:"Can I convert an entire web page by pasting its HTML?",
    a:"Yes — paste the full HTML source (including head, body, scripts, nav, footer etc.) and our converter will extract the meaningful text content while stripping structural HTML, scripts, styles and invisible elements. For best results when extracting a specific article, copy just the article's HTML rather than the entire page source." },
];

interface ConvertOptions {
  gfmTables:   boolean;
  codeBlocks:  boolean;
  stripScripts:boolean;
  keepImages:  boolean;
  setext:      boolean;
  bulletChar:  "-" | "*" | "+";
}

// ── HTML → Markdown converter (DOMParser-based) ────────────────────────────

function nodeToMd(node: Node, opts: ConvertOptions, depth = 0): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/\n\s*/g, " ");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el    = node as HTMLElement;
  const tag   = el.tagName?.toLowerCase() ?? "";
  const inner = () => Array.from(el.childNodes).map(c => nodeToMd(c, opts, depth)).join("").trim();

  if (opts.stripScripts && ["script","style","nav","footer","header","aside","iframe","noscript"].includes(tag)) return "";

  switch (tag) {
    case "h1": return opts.setext ? `${inner()}\n${"=".repeat(inner().length || 6)}\n\n` : `# ${inner()}\n\n`;
    case "h2": return opts.setext ? `${inner()}\n${"-".repeat(inner().length || 6)}\n\n` : `## ${inner()}\n\n`;
    case "h3": return `### ${inner()}\n\n`;
    case "h4": return `#### ${inner()}\n\n`;
    case "h5": return `##### ${inner()}\n\n`;
    case "h6": return `###### ${inner()}\n\n`;

    case "p":   return `${inner()}\n\n`;
    case "br":  return "  \n";
    case "hr":  return "---\n\n";

    case "strong":
    case "b":   return `**${inner()}**`;
    case "em":
    case "i":   return `*${inner()}*`;
    case "del":
    case "s":   return `~~${inner()}~~`;
    case "u":   return inner();

    case "a": {
      const href  = el.getAttribute("href") ?? "#";
      const title = el.getAttribute("title") ? ` "${el.getAttribute("title")}"` : "";
      return `[${inner()}](${href}${title})`;
    }
    case "img": {
      if (!opts.keepImages) return "";
      return `![${el.getAttribute("alt") ?? ""}](${el.getAttribute("src") ?? ""})`;
    }

    case "code": {
      if ((el.parentElement?.tagName ?? "").toLowerCase() === "pre") return el.textContent ?? "";
      return `\`${el.textContent}\``;
    }
    case "pre": {
      const codeEl = el.querySelector("code");
      const lang   = codeEl?.className.match(/language-(\w+)/)?.[1] ?? "";
      const content = (codeEl?.textContent ?? el.textContent ?? "").trim();
      if (opts.codeBlocks) return `\`\`\`${lang}\n${content}\n\`\`\`\n\n`;
      return `    ${content.split("\n").join("\n    ")}\n\n`;
    }

    case "blockquote": return inner().split("\n").map(l => `> ${l}`).join("\n") + "\n\n";

    case "ul": {
      const items = Array.from(el.querySelectorAll(":scope > li"))
        .map(li => `${opts.bulletChar} ${nodeToMd(li, opts, depth + 1).trim()}`);
      return items.join("\n") + "\n\n";
    }
    case "ol": {
      const items = Array.from(el.querySelectorAll(":scope > li"))
        .map((li, i) => `${i+1}. ${nodeToMd(li, opts, depth + 1).trim()}`);
      return items.join("\n") + "\n\n";
    }
    case "li": return inner();

    case "table": {
      if (!opts.gfmTables) return inner();
      const rows: string[][] = [];
      el.querySelectorAll("tr").forEach(tr => {
        rows.push(Array.from(tr.querySelectorAll("th,td")).map(c => c.textContent?.trim() ?? ""));
      });
      if (!rows.length) return "";
      const header = rows[0];
      const sep    = header.map(h => "-".repeat(Math.max(h.length, 3)));
      return [header, sep, ...rows.slice(1)].map(r => `| ${r.join(" | ")} |`).join("\n") + "\n\n";
    }

    case "div":
    case "main":
    case "article":
    case "section":
    case "body":
    case "span":
    default:
      return inner().trim()
        ? inner() + (["div","section","article","main"].includes(tag) ? "\n\n" : "")
        : "";
  }
}

function htmlToMarkdown(html: string, opts: ConvertOptions): string {
  if (typeof window === "undefined") return "";
  const doc  = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  if (!body) return "";
  return Array.from(body.childNodes).map(c => nodeToMd(c, opts)).join("").trim().replace(/\n{3,}/g, "\n\n");
}

const SAMPLE_HTML = `<h1>Getting Started with PursTech</h1>
<p>PursTech is the world's most advanced <strong>free online tool ecosystem</strong>. Built for <em>developers, designers and creators</em> who want to stop searching and start doing.</p>

<h2>Key Features</h2>
<ul>
  <li>30+ professional-grade tools</li>
  <li>100% browser-based — <strong>no uploads</strong></li>
  <li>Completely free forever</li>
</ul>

<h2>Code Example</h2>
<pre><code class="language-javascript">const result = await fetch('/api/tools');
const tools = await result.json();
console.log(tools);</code></pre>

<h2>Comparison Table</h2>
<table>
  <thead><tr><th>Feature</th><th>Free</th><th>Pro</th></tr></thead>
  <tbody>
    <tr><td>Tool access</td><td>Unlimited</td><td>Unlimited</td></tr>
    <tr><td>Ads</td><td>Yes</td><td>No</td></tr>
    <tr><td>API access</td><td>No</td><td>Yes</td></tr>
  </tbody>
</table>

<blockquote>
  <p>"Stop Searching. Start Doing." — PursTech Tagline</p>
</blockquote>

<p>Visit <a href="https://purstech.com">purstech.com</a> to get started.</p>`;

// ── Main Component ─────────────────────────────────────────────────────────

export default function HtmlToMarkdownClient() {
  // ✅ Track usage
  useTrackTool("html-to-markdown", "dev");

  const [input,       setInput]       = useState(SAMPLE_HTML);
  const [opts,        setOpts]        = useState<ConvertOptions>({
    gfmTables: true, codeBlocks: true, stripScripts: true,
    keepImages: true, setext: false, bulletChar: "-",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [copied,      setCopied]      = useState(false);

  const output = useMemo(() => {
    if (typeof window === "undefined") return "";
    return htmlToMarkdown(input, opts);
  }, [input, opts]);

  // Simple Markdown → HTML for preview pane
  const previewHtml = useMemo(() => output
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^#{6}\s(.+)$/gm, "<h6>$1</h6>").replace(/^#{5}\s(.+)$/gm, "<h5>$1</h5>")
    .replace(/^#{4}\s(.+)$/gm, "<h4>$1</h4>").replace(/^#{3}\s(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s(.+)$/gm, "<h2>$1</h2>").replace(/^#{1}\s(.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*+] (.+)$/gm, "<li>$1</li>")
    .replace(/^---$/gm, "<hr/>").replace(/\n\n/g, "<br/><br/>"),
  [output]);

  function toggle(k: keyof ConvertOptions) {
    setOpts(p => ({ ...p, [k]: !p[k as keyof ConvertOptions] }));
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([output], { type: "text/markdown" })),
      download: "converted.md",
    }).click();
  }

  async function pasteFromClipboard() {
    try {
      setInput(await navigator.clipboard.readText());
    } catch { alert("Clipboard access denied — paste manually into the input area."); }
  }

  // ✅ UI Enhancement 2: word count for stats bar
  const wordCount = output.trim()
    ? output.trim().split(/\s+/).filter(w => /\w/.test(w)).length
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          {/* ✅ Added Go Pro */}
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro"
              className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">
              Go Pro ⚡
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb — ✅ aria-label + /categories/dev */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/dev" className="hover:text-gray-400">Dev Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">HTML to Markdown</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Developer Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free HTML to Markdown Converter — Clean GFM Output Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Convert HTML to clean, readable Markdown. Preserves headings, bold, italic, links, images, code blocks, tables and lists. Outputs GitHub Flavored Markdown with full customisation options.
          </p>
        </div>

        {/* Options */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Options:</span>
          {[
            { key:"gfmTables",    label:"GFM Tables"     },
            { key:"codeBlocks",   label:"Fenced Code"    },
            { key:"keepImages",   label:"Keep Images"    },
            { key:"stripScripts", label:"Strip Scripts"  },
            { key:"setext",       label:"Setext Headers" },
          ].map(o => (
            <button key={o.key}
              onClick={() => toggle(o.key as keyof ConvertOptions)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                opts[o.key as keyof ConvertOptions]
                  ? "bg-[#6C3AFF] text-white border-transparent"
                  : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
              }`}>
              {opts[o.key as keyof ConvertOptions] ? "✓ " : ""}{o.label}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-gray-500">Bullets:</span>
            {(["-","*","+"] as const).map(c => (
              <button key={c} onClick={() => setOpts(p => ({ ...p, bulletChar: c }))}
                className={`w-7 h-7 rounded-lg text-sm font-mono font-bold transition-all border ${
                  opts.bulletChar === c ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                }`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* HTML Input */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">HTML Input</label>
              <div className="flex gap-2 items-center">
                <button onClick={pasteFromClipboard}
                  className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs transition-all">
                  📋 Paste HTML
                </button>
                {/* ✅ UI Enhancement 1: Load sample button */}
                <button onClick={() => setInput(SAMPLE_HTML)}
                  className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2">
                  Load sample
                </button>
                <button onClick={() => setInput("")}
                  className="text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors">
                  Clear
                </button>
              </div>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={22}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#6C3AFF]/60 resize-none transition-all leading-relaxed" />
          </div>

          {/* Markdown Output + Preview */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1 bg-[#0A0A14] p-0.5 rounded-lg">
                <button onClick={() => setShowPreview(false)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${!showPreview ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                  Markdown
                </button>
                <button onClick={() => setShowPreview(true)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${showPreview ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                  Preview
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={copy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? "bg-green-600 text-white" : "bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white"}`}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button onClick={download}
                  className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                  ⬇ .md
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="bg-white rounded-xl p-5 min-h-[400px] prose prose-sm max-w-none overflow-auto"
                style={{ color:"#1a1a2e", fontFamily:"system-ui, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <textarea readOnly value={output} rows={22}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-green-400 text-xs font-mono resize-none leading-relaxed" />
            )}
          </div>
        </div>

        {/* ✅ UI Enhancement 2: Stats bar with word count */}
        <div className="mt-4 flex gap-4 text-xs text-gray-500 flex-wrap">
          <span>Input: <span className="text-gray-400">{input.length} chars</span></span>
          <span>Output: <span className="text-gray-400">{output.length} chars</span></span>
          <span>Words: <span className="text-gray-400">{wordCount.toLocaleString()}</span></span>
          <span>Lines: <span className="text-gray-400">{output.split("\n").length}</span></span>
          <span>Reduction: <span className={input.length > 0 ? "text-green-400 font-semibold" : "text-gray-400"}>
            {input.length > 0 ? `${((1 - output.length / input.length) * 100).toFixed(0)}%` : "0%"}
          </span></span>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Convert HTML to Markdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Paste your HTML",      desc:"Paste HTML source code into the left panel. Use the Paste HTML button to grab from your clipboard, or type directly." },
              { step:"2", title:"Configure options",    desc:"Toggle GFM Tables, fenced code blocks, image handling and header style. Choose your preferred bullet character." },
              { step:"3", title:"Review the output",    desc:"The Markdown output appears instantly on the right. Toggle to Preview mode to see how the Markdown will render." },
              { step:"4", title:"Copy or download",     desc:"Copy the Markdown to clipboard or download as a .md file ready for GitHub, Notion, Obsidian or any Markdown platform." },
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

        {/* FAQ — always last */}
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

      {/* Footer — ✅ About→Terms, © 2025→2026 */}
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
