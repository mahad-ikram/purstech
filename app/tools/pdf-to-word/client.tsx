"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ SCHEMA removed — now server-rendered as WebApplication in page.tsx

/* ── FAQ — Rule 10: module scope, matches FAQ.map() below ─────────────────── */
/* ── Rule 8: already uses <details>/<summary> ─────────────────────────────── */
const FAQ = [
  { q:"How do I convert a PDF to Word?",
    a:"Drop your PDF onto the converter, let it extract the text, preview and tidy the result, then download it as a .doc file that opens straight in Microsoft Word or Google Docs. The whole conversion runs in your browser — the file never uploads to a server." },
  { q:"Can I convert a scanned PDF to Word?",
    a:"Not directly — a scanned PDF is a photo of a page, with no real text inside. Run it through our free Image to Text (OCR) tool first to extract the words, then paste them into Word. This converter handles text-based PDFs." },
  { q:"Why are some characters showing as garbled or replaced with question marks?",
    a:"This happens when a PDF uses embedded fonts with non-standard character encodings. The PDF specification allows fonts to use custom encoding tables, which can make text extraction ambiguous. In these cases the extracted text may have placeholder characters — a specialised desktop tool may give better results." },
  { q: "Which types of PDFs can be converted?",
    a: "This tool extracts text from text-based PDFs — PDFs created digitally from Word documents, web pages or other software. Scanned PDFs (images of paper pages) require OCR. If you upload a scanned PDF and get empty text, try our Image to Text tool instead, which uses Tesseract.js to process image-based pages." },
  { q: "Will the formatting be preserved?",
    a: "Basic text content is extracted faithfully, but complex formatting like tables, multi-column layouts, headers and footers cannot be perfectly reconstructed. The extracted text reflects the reading order of the PDF's text objects. For .doc output, text is wrapped in a basic Word document structure with standard paragraph formatting." },
  { q: "What is the difference between .doc, .txt and .html output?",
    a: ".txt is plain text with no formatting — the simplest and most compatible format. .doc wraps the text in a Word-compatible XML structure, allowing the file to open in Microsoft Word or Google Docs for further editing. .html creates a web-viewable file suitable for pasting into web editors or content management systems." },
  { q: "Can I edit the extracted text before downloading?",
    a: "Yes. The extracted text appears in an editable text area. You can correct any artifacts, fix line breaks, add or remove content before downloading or copying to clipboard. This is especially useful for cleaning up PDFs with unusual text encoding or non-standard fonts." },
  { q: "Why are some characters showing as garbled or replaced with '?' marks?",
    a: "This happens when a PDF uses embedded fonts with non-standard character encodings. The PDF specification allows fonts to use custom encoding tables, which can make text extraction ambiguous. In these cases the extracted text may have placeholder characters. A specialised desktop tool may give better results for highly encoded PDFs." },
];

type Format = "doc" | "txt" | "html";

declare global { interface Window { pdfjsLib: unknown; } }

const loadPdfJs = async () => {
  if (typeof window === "undefined") return null;
  if (window.pdfjsLib) return window.pdfjsLib as Record<string, unknown>;
  await new Promise<void>((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => res(); s.onerror = () => rej(new Error("Failed to load PDF.js"));
    document.head.appendChild(s);
  });
  (window.pdfjsLib as Record<string, unknown>);
  const lib = window.pdfjsLib as {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (opts: unknown) => { promise: Promise<unknown> };
  };
  lib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return lib;
};

export default function PDFToWordClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("pdf-to-word", "pdf"); // ✅ Rule 3

  const [file,       setFile]       = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [pages,      setPages]      = useState<string[]>([]);
  const [editedText, setEditedText] = useState("");
  const [format,     setFormat]     = useState<Format>("doc");
  const [dragging,   setDragging]   = useState(false);
  const [error,      setError]      = useState("");
  const [cleanup,    setCleanup]    = useState(true);
  const [viewMode,   setViewMode]   = useState<"full"|"pages">("full");
  const [activePage, setActivePage] = useState(0);
  const [copied,     setCopied]     = useState(false); 
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanText = useCallback((t: string) =>
    t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(), []);

  const processFile = useCallback(async (f: File) => {
    setFile(f); setExtracting(true); setError(""); setPages([]); setEditedText("");
    try {
      const lib = await loadPdfJs();
      if (!lib) throw new Error("PDF.js could not be loaded");
      const buf = await f.arrayBuffer();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdf = await (lib as any).getDocument({ data: buf }).promise;
      const pageTexts: string[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (let i = 1; i <= (pdf as any).numPages; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pg  = await (pdf as any).getPage(i);
        const ctx = await pg.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = ctx.items.map((item: any) => item.str).join(" ");
        pageTexts.push(raw);
      }
      const combined = pageTexts.map((t, i) => `--- Page ${i+1} ---\n${t}`).join("\n\n");
      const final    = cleanup ? cleanText(combined) : combined;
      setPages(pageTexts);
      setEditedText(final);
    } catch {
      setError("Could not extract text. This PDF may be encrypted, scanned (image-only) or use unsupported encoding.");
    }
    setExtracting(false);
  }, [cleanup, cleanText]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const copyToClipboard = async () => {
    if (!editedText) return;
    await navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const content = editedText;
    let blob: Blob, filename: string;

    if (format === "txt") {
      blob = new Blob([content], { type: "text/plain" });
      filename = `${file?.name.replace(".pdf","") ?? "document"}.txt`;
    } else if (format === "html") {
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${file?.name ?? "document"}</title>
<style>body{max-width:800px;margin:2rem auto;font-family:Georgia,serif;line-height:1.6;color:#1a1a1a;padding:0 1rem}p{margin:0 0 1rem}</style></head><body>
${content.split("\n").filter(l => l.trim()).map(l => `<p>${l.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</p>`).join("\n")}
</body></html>`;
      blob = new Blob([html], { type: "text/html" });
      filename = `${file?.name.replace(".pdf","") ?? "document"}.html`;
    } else {
      const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
<w:body>
${content.split("\n").filter(l => l.trim()).map(l =>
  `<w:p><w:r><w:t xml:space="preserve">${l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</w:t></w:r></w:p>`
).join("\n")}
</w:body></w:wordDocument>`;
      blob = new Blob([docXml], { type: "application/msword" });
      filename = `${file?.name.replace(".pdf","") ?? "document"}.doc`;
    }
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: filename,
    }).click();
  };

  const words = editedText.trim() ? editedText.trim().split(/\s+/).length : 0;
  const chars = editedText.length;

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
      <main className="max-w-4xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/pdf + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/pdf" className="hover:text-gray-400">PDF Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">PDF to Word</span>
        </nav>

        {/* Server-rendered hero */}
        {children}

        {/* Options row */}
        <div className="flex flex-wrap gap-3 items-center mb-5">
          <div className="flex items-center gap-2 bg-[#13131F] border border-white/5 rounded-xl px-4 py-2.5">
            <button onClick={() => setCleanup(p => !p)}
              className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${cleanup ? "bg-[#FF3A6C]" : "bg-gray-700"}`}
              role="switch" aria-checked={cleanup}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${cleanup ? "left-[22px]" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-white">Clean up whitespace</span>
          </div>

          <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
            {(["doc","txt","html"] as Format[]).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${format===f ? "bg-[#FF3A6C] text-white" : "text-gray-400 hover:text-white"}`}>
                .{f}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone — ✅ QA FIX: min-w-0 w-full added */}
        {!file && (
          <div
            onDrop={onDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all min-w-0 w-full ${
              dragging ? "border-[#FF3A6C]/60 bg-[#FF3A6C]/5" : "border-white/10 hover:border-[#FF3A6C]/30 bg-[#13131F]"
            }`}>
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            <div className="text-4xl mb-3">📝</div>
            <div className="font-bold text-white mb-1">Drop a PDF here or click to browse</div>
            <div className="text-xs text-gray-500">Works with text-based PDFs · Not scanned images</div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 min-w-0 w-full">{error}</div>
        )}

        {extracting && (
          <div className="mt-6 text-center py-10 text-gray-400">
            <div className="text-3xl mb-3 animate-spin">⚙️</div>
            Extracting text from PDF…
          </div>
        )}

        {pages.length > 0 && (
          <div className="mt-5 space-y-4 min-w-0 w-full">
            {/* File info + stats */}
            {/* ✅ Rule 9 ext: min-w-0 on flex container + truncate on filename */}
            <div className="bg-[#13131F] border border-white/5 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 min-w-0 w-full">
              <div className="flex items-center gap-3 text-sm min-w-0">
                <span className="text-2xl flex-shrink-0">📄</span>
                <span className="font-semibold text-white truncate min-w-0">{file?.name}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-500 flex-shrink-0">
                <span>{pages.length} pages</span>
                <span className="hidden sm:inline">{words.toLocaleString()} words</span>
                <span className="hidden sm:inline">{chars.toLocaleString()} chars</span>
                <button onClick={() => { setFile(null); setPages([]); setEditedText(""); }}
                  className="text-[#FF3A6C] hover:text-white transition-colors font-semibold">Change file</button>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl w-fit">
              {(["full","pages"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${viewMode===v ? "bg-[#FF3A6C] text-white" : "text-gray-400 hover:text-white"}`}>
                  {v === "full" ? "Full text" : "Page by page"}
                </button>
              ))}
            </div>

            {/* Text editor */}
            {viewMode === "full" ? (
              <div className="min-w-0 w-full">
                <div className="text-xs text-gray-500 mb-2">Edit before downloading:</div>
                {/* ✅ QA FIX: text area is safe, but parent bound with min-w-0 w-full */}
                <textarea value={editedText} onChange={e => setEditedText(e.target.value)} rows={20}
                  className="w-full px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-gray-300 text-sm font-mono leading-relaxed focus:outline-none focus:border-[#FF3A6C]/30 resize-none transition-all min-w-0" />
              </div>
            ) : (
              <div className="min-w-0 w-full">
                <div className="flex gap-2 flex-wrap mb-3">
                  {pages.map((_, i) => (
                    <button key={i} onClick={() => setActivePage(i)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                        activePage===i ? "bg-[#FF3A6C] border-transparent text-white" : "bg-[#13131F] border-white/10 text-gray-400 hover:text-white"
                      }`}>
                      {i+1}
                    </button>
                  ))}
                </div>
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
                  <div className="text-xs text-gray-500 mb-2">Page {activePage+1} of {pages.length}</div>
                  {/* ✅ QA FIX: Added break-words to ensure messy extraction strings don't break flex boundaries */}
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words font-mono min-w-0 w-full">
                    {pages[activePage] || "(No text on this page)"}
                  </p>
                </div>
              </div>
            )}

            {/* ✅ UI Enhancement: Copy + Download buttons */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 min-w-0 w-full">
              <button onClick={copyToClipboard}
                className={`flex-1 py-4 rounded-2xl font-extrabold text-lg transition-all min-w-0 w-full ${
                  copied ? "bg-green-600 text-white" : "bg-[#13131F] border border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                }`}>
                {copied ? "✓ Copied!" : "📋 Copy Text"}
              </button>
              <button onClick={download}
                className="flex-1 py-4 rounded-2xl bg-[#FF3A6C] hover:bg-[#d42d5a] text-white font-extrabold text-lg transition-all min-w-0 w-full">
                ⬇ Download .{format}
              </button>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Convert PDF to Word</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Choose output format",    desc:"Select .doc for Word compatibility, .txt for plain text, or .html for web use. Enable whitespace cleanup for cleaner output." },
              { step:"2", title:"Upload your PDF",         desc:"Drag and drop a text-based PDF. The tool uses PDF.js to extract text directly in your browser — nothing is uploaded." },
              { step:"3", title:"Review and edit",         desc:"Read the extracted text in Full or Page-by-page view. Edit directly in the text area to fix any extraction artifacts." },
              { step:"4", title:"Copy or download",        desc:"Click Copy Text to paste into Word, Notion or email, or click Download to save as .doc, .txt or .html file." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FF3A6C] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — Rule 8: <details>/<summary>, Rule 10: FAQ.map() matches const FAQ above */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF3A6C]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#FF3A6C] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Rule 5: /about→/terms + Privacy/Terms/Contact */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center">
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