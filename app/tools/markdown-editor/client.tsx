"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ ADDED

// ✅ SCHEMA removed — now server-rendered as WebApplication in page.tsx

const FAQ = [
  { q:"What is Markdown and when should I use it?",
    a:"Markdown is a plain-text formatting syntax that converts to HTML. Use it for README files on GitHub/GitLab, writing documentation, blog posts (Ghost, Jekyll, Hugo, Gatsby), notes in Obsidian or Notion, comments on Stack Overflow and Reddit, and chat formatting in Slack, Discord and Microsoft Teams. Its key advantage is that the raw text is human-readable even without rendering — unlike HTML or rich-text editors." },
  { q:"What is GitHub Flavored Markdown (GFM) and what extra features does it add?",
    a:"GFM extends standard Markdown with: tables (using | pipe characters), task lists (- [ ] for unchecked, - [x] for checked), strikethrough (~~text~~), fenced code blocks with syntax highlighting (```language), autolinks, and @mentions. GFM is the standard on GitHub, GitLab, VS Code preview, and most developer platforms. Our editor supports all GFM features." },
  { q:"How do I create a table in Markdown?",
    a:"Use pipe characters to separate columns and hyphens for the header separator row. Example: | Name | Age | City | on the first row, | --- | --- | --- | on the second row, then data rows. Add colons to control alignment: :--- for left, :---: for centre, ---: for right. Use our toolbar's table button to insert a pre-formatted table template instantly." },
  { q:"Can I add syntax-highlighted code in Markdown?",
    a:"Yes — use triple backtick fenced code blocks with a language identifier. For example: three backticks followed by 'javascript', your code, then three closing backticks. Supported language identifiers include: javascript, typescript, python, java, css, html, json, bash, sql, go, rust, php, ruby and many more. Inline code uses a single backtick on each side." },
  { q:"How do I export my Markdown as an HTML file?",
    a:"Click Export HTML — it converts your Markdown to a complete HTML file with basic styling and downloads it immediately. For a raw .md file, click Download .md. To copy the rendered HTML directly for use in an email or CMS, click Copy HTML in the editor footer bar." },
];

/* ── Markdown → HTML renderer ────────────────────────────────────────────────*/
function renderMarkdown(md: string): string {
  let html = md;

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre class="md-pre"><code class="language-${lang}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
  );

  html = html.replace(/^- \[x\] (.+)$/gm, '<li class="task done">✓ $1</li>');
  html = html.replace(/^- \[ \] (.+)$/gm, '<li class="task">☐ $1</li>');

  html = html.replace(/^#{6} (.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#{5} (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#{4} (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^#{3} (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#{2} (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm,   "<h1>$1</h1>");

  html = html.replace(/^(.+)\n={3,}$/gm, "<h1>$1</h1>");
  html = html.replace(/^(.+)\n-{3,}$/gm, "<h2>$1</h2>");

  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g,     "<em>$1</em>");
  html = html.replace(/__(.+?)__/g,     "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g,       "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g,     "<del>$1</del>");

  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,  '<a href="$2" target="_blank" rel="noopener">$1</a>');

  html = html.replace(/^(---|\*\*\*|___)\s*$/gm, "<hr>");

  html = html.replace(/(^\|.+\|\n)(^\|[-: |]+\|\n)((?:^\|.+\|\n?)*)/gm, (_, head, _sep, body) => {
    const parseRow = (row: string) =>
      row.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    const headCols = parseRow(head);
    const bodyCols = body.trim().split("\n").filter(Boolean).map(parseRow);
    const ths = headCols.map(c => `<th>${c}</th>`).join("");
    const trs = bodyCols.map((r: string[]) => `<tr>${r.map((c: string) => `<td>${c}</td>`).join("")}</tr>`).join("");
    return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  });

  html = html.replace(/(^[-*+] .+\n?)+/gm, match =>
    "<ul>" + match.trim().split("\n").filter(Boolean)
      .map(l => `<li>${l.replace(/^[-*+] /, "")}</li>`).join("") + "</ul>"
  );
  html = html.replace(/(^\d+\. .+\n?)+/gm, match =>
    "<ol>" + match.trim().split("\n").filter(Boolean)
      .map(l => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("") + "</ol>"
  );

  html = html.replace(/\n\n([^<\n].+)/g, "\n<p>$1</p>");
  html = html.replace(/^([^<\n#>|].+)$/gm, "<p>$1</p>");
  html = html.replace(/<p><p>/g, "<p>").replace(/<\/p><\/p>/g, "</p>");

  return html;
}

function countStats(md: string) {
  const words    = md.trim() ? md.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars    = md.length;
  const lines    = md.split("\n").length;
  const readMins = Math.max(1, Math.ceil(words / 200));
  return { words, chars, lines, readMins };
}

const INITIAL = `# Welcome to PursTech Markdown Editor

Write **Markdown** here and see a *live preview* on the right.

## Features

- Real-time split-pane preview
- GFM tables and task lists
- Syntax-highlighted code blocks
- Export as HTML or .md file
- Word count and reading time

## GFM Table Example

| Feature | Free | Pro |
| --- | :---: | :---: |
| All Tools | ✓ | ✓ |
| Ad-free | ✗ | ✓ |
| API Access | ✗ | ✓ |

## Task List

- [x] Build the homepage
- [x] Create 30 tools
- [ ] Launch Pro subscription
- [ ] Build AI agents

## Code Block

\`\`\`javascript
const greet = (name) => \`Hello, \${name}! Welcome to PursTech.\`;
console.log(greet("Developer"));
\`\`\`

> "Stop Searching. Start Doing." — PursTech

---

Visit [purstech.com](https://purstech.com) to explore all tools.
`;

export default function MarkdownEditorClient() {
  useTrackTool("markdown-editor", "dev"); // ✅ ADDED

  const [md,          setMd]          = useState(INITIAL);
  const [layout,      setLayout]      = useState<"split"|"editor"|"preview">("split");
  const [darkPreview, setDarkPreview] = useState(false);
  const [copiedHtml,  setCopiedHtml]  = useState(false); 
  const [copiedMd,    setCopiedMd]    = useState(false);
  const [fullscreen,  setFullscreen]  = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const html  = useMemo(() => renderMarkdown(md), [md]);
  const stats = useMemo(() => countStats(md), [md]);

  /* ── Toolbar actions ──────────────────────────────────────────────────── */
  const wrap = useCallback((before: string, after: string, placeholder = "text") => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const sel  = md.slice(start, end) || placeholder;
    const next = md.slice(0, start) + before + sel + after + md.slice(end);
    setMd(next);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd   = start + before.length + sel.length;
    }, 0);
  }, [md]);

  const insertLine = useCallback((prefix: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start     = ta.selectionStart;
    const lineStart = md.lastIndexOf("\n", start - 1) + 1;
    const next      = md.slice(0, lineStart) + prefix + md.slice(lineStart);
    setMd(next);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = lineStart + prefix.length; }, 0);
  }, [md]);

  const insertAt = useCallback((text: string) => {
    const ta  = taRef.current;
    if (!ta) return;
    const pos  = ta.selectionStart;
    const next = md.slice(0, pos) + text + md.slice(pos);
    setMd(next);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + text.length; }, 0);
  }, [md]);

  const tools = [
    { icon:"B",   title:"Bold",          action: () => wrap("**", "**")                              },
    { icon:"I",   title:"Italic",        action: () => wrap("*", "*")                               },
    { icon:"S",   title:"Strikethrough", action: () => wrap("~~", "~~")                             },
    { icon:"H1",  title:"Heading 1",     action: () => insertLine("# ")                             },
    { icon:"H2",  title:"Heading 2",     action: () => insertLine("## ")                            },
    { icon:"H3",  title:"Heading 3",     action: () => insertLine("### ")                           },
    { icon:"‹›",  title:"Inline Code",   action: () => wrap("`", "`", "code")                       },
    { icon:"⟨⟩",  title:"Code Block",    action: () => wrap("```javascript\n", "\n```", "// code") },
    { icon:">",   title:"Blockquote",    action: () => insertLine("> ")                             },
    { icon:"•",   title:"Bullet List",   action: () => insertLine("- ")                             },
    { icon:"1.",  title:"Numbered List", action: () => insertLine("1. ")                            },
    { icon:"☐",   title:"Task List",     action: () => insertLine("- [ ] ")                         },
    { icon:"🔗",  title:"Link",          action: () => wrap("[", "](https://)", "link text")         },
    { icon:"—",   title:"HR",            action: () => insertAt("\n\n---\n\n")                       },
    { icon:"⊞",   title:"Table",         action: () => insertAt("\n| Header | Header | Header |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n| Cell | Cell | Cell |\n") },
  ];

  function exportHTML() {
    const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exported from PursTech Markdown Editor</title>
<style>
  body { max-width: 800px; margin: 2rem auto; font-family: system-ui, sans-serif; line-height: 1.6; color: #1a1a2e; padding: 0 1rem; }
  h1,h2,h3,h4,h5,h6 { margin-top: 1.5em; }
  pre { background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
  code { background: #f0f0f0; padding: 2px 4px; border-radius: 4px; font-size: 0.9em; }
  table { border-collapse: collapse; width: 100%; } th,td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
  th { background: #f0f0f0; }
  blockquote { border-left: 4px solid #6C3AFF; margin: 0; padding: 0.5rem 1rem; color: #555; }
  img { max-width: 100%; } hr { border: none; border-top: 2px solid #eee; margin: 2rem 0; }
</style>
</head>
<body>
${html}
</body>
</html>`;
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([full], { type: "text/html" })),
      download: "document.html",
    }).click();
  }

  function downloadMd() {
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([md], { type: "text/markdown" })),
      download: "document.md",
    }).click();
  }

  const fullscreenClass = fullscreen
    ? "fixed inset-0 z-50 bg-[#0A0A14] flex flex-col overflow-hidden"
    : "bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden";

  return (
    // ✅ CRITICAL Mobile Fortification Fixes Applied
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Layout bounds locked to keep textarea elements from stretching frames */}
      <main className={`flex-grow w-full ${fullscreen ? "flex flex-col" : "max-w-7xl mx-auto px-4 py-10"}`}>
        {!fullscreen && (
          <>
            {/* Breadcrumb — responsive wrap added */}
            <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex flex-wrap items-center gap-2">
              <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
              <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
              <Link href="/categories/dev" className="hover:text-gray-400">Dev Tools</Link><span aria-hidden="true">›</span>
              <span className="text-gray-400">Markdown Editor</span>
            </nav>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Developer Tools</div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Free Online Markdown Editor — Live Preview, GFM Tables &amp; Export
              </h1>
              <p className="text-gray-400 max-w-2xl">Write Markdown with a live split-pane preview. Full formatting toolbar, GitHub Flavored Markdown, task lists, tables, word count and export to HTML or .md.</p>
            </div>
          </>
        )}

        {/* Editor Frame Container */}
        <div className={fullscreenClass}>

          {/* Toolbar panel */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 flex-wrap bg-[#0A0A14]">
            {tools.map(t => (
              <button key={t.title} onClick={t.action} title={t.title}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-[#6C3AFF]/20 transition-all font-mono">
                {t.icon}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex gap-0.5 bg-[#13131F] p-0.5 rounded-lg">
                {(["editor","split","preview"] as const).map(l => (
                  <button key={l} onClick={() => setLayout(l)}
                    className={`px-2 py-1 rounded-md text-xs transition-all ${layout===l ? "bg-[#6C3AFF] text-white" : "text-gray-500 hover:text-white"}`}>
                    {l === "split" ? "⊟" : l === "editor" ? "✎" : "👁"}
                  </button>
                ))}
              </div>

              <button onClick={() => setDarkPreview(p => !p)}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all border ${darkPreview ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}>
                {darkPreview ? "🌙" : "☀️"}
              </button>

              <button onClick={() => setFullscreen(p => !p)}
                className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-all border border-white/10">
                {fullscreen ? "✕" : "⛶"}
              </button>
            </div>
          </div>

          {/* Editor/Preview Split View Layout Logic */}
          {/* ✅ Bounded parameters applied securely to support stacking split panes gracefully on smartphones */}
          <div className={`flex flex-col md:flex-row ${fullscreen ? "flex-1 min-h-0" : "h-[600px]"} overflow-hidden min-w-0 w-full`}>
            {(layout === "editor" || layout === "split") && (
              <textarea
                ref={taRef}
                value={md}
                onChange={e => setMd(e.target.value)}
                spellCheck={false}
                className={`${layout === "split" ? "w-full md:w-1/2" : "w-full"} h-full px-5 py-4 bg-[#0A0A14] text-white text-sm font-mono resize-none focus:outline-none leading-relaxed border-r border-white/5 min-w-0`} />
            )}
            {(layout === "preview" || layout === "split") && (
              <div className={`${layout === "split" ? "w-full md:w-1/2" : "w-full"} h-full overflow-y-auto min-w-0`}>
                <div
                  className={`min-h-full p-6 prose max-w-none break-words ${darkPreview ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
                  style={{ fontFamily:"system-ui, sans-serif", lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            )}
          </div>

          {/* Action Status Footer bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-[#0A0A14] flex-wrap gap-2">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>{stats.words} words</span>
              <span>{stats.chars} chars</span>
              <span>{stats.lines} lines</span>
              <span>~{stats.readMins} min read</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => { navigator.clipboard.writeText(md); setCopiedMd(true); setTimeout(() => setCopiedMd(false), 2000); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${copiedMd ? "bg-green-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:text-white"}`}>
                {copiedMd ? "✓ MD Paid!" : "Copy MD"}
              </button>
              {/* ✅ Connected Copy HTML interface element button */}
              <button onClick={() => { navigator.clipboard.writeText(html); setCopiedHtml(true); setTimeout(() => setCopiedHtml(false), 2000); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${copiedHtml ? "bg-green-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:text-white"}`}>
                {copiedHtml ? "✓ HTML Paid!" : "Copy HTML"}
              </button>
              <button onClick={downloadMd}
                className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all">
                ⬇ .md
              </button>
              <button onClick={exportHTML}
                className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                ⬇ Export HTML
              </button>
            </div>
          </div>
        </div>

        {!fullscreen && (
          <>
            {/* Walkthrough Guidelines */}
            <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Markdown Editor</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step:"1", title:"Write in the editor",    desc:"Type Markdown in the left pane. Use the toolbar buttons for quick formatting — bold, italic, headings, code, lists, tables and more." },
                  { step:"2", title:"Watch the live preview", desc:"The right pane renders your Markdown in real time. Switch between Split, Editor-only or Preview-only layouts." },
                  { step:"3", title:"Toggle dark preview",    desc:"Click the sun/moon button to switch the preview between light and dark mode — useful for checking content in different environments." },
                  { step:"4", title:"Export in your format",  desc:"Download as .md for GitHub, Copy HTML for email or CMS use, or export as a complete HTML file ready to open in any browser." },
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

            {/* Accordion FAQ Area */}
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
          </>
        )}
      </main>

      {/* Standardized Master Footer */}
      {!fullscreen && (
        <footer className="border-t border-white/5 mt-auto py-8 text-center bg-[#0A0A14]">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex justify-center flex-wrap gap-6 mt-3 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}